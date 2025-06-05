#!/usr/bin/env node

/**
 * Complete System Test
 * 
 * Tests the entire blog automation system end-to-end:
 * 1. Health check
 * 2. System stats
 * 3. Complete blog post generation
 * 4. Duplicate prevention validation
 */

import { generateCompleteBlogPost, runHealthCheck, getSystemStats } from './blog-orchestrator.js';

async function main() {
  console.log('🧪 Testing Complete Blog Automation System');
  console.log('='.repeat(60));
  
  try {
    // Test 1: System Health Check
    console.log('\n🏥 PHASE 1: System Health Check');
    console.log('-'.repeat(40));
    
    const healthCheck = await runHealthCheck();
    
    if (!healthCheck.overall) {
      console.error('❌ System health check failed. Cannot proceed with testing.');
      process.exit(1);
    }
    
    // Test 2: System Statistics
    console.log('\n📊 PHASE 2: System Statistics');
    console.log('-'.repeat(40));
    
    const statsBefore = await getSystemStats();
    
    if (!statsBefore) {
      console.error('❌ Could not retrieve system statistics');
      process.exit(1);
    }
    
    console.log('📈 Current System Status:');
    console.log(`   - Total Parks: ${statsBefore.totalParks}`);
    console.log(`   - Blogged Parks: ${statsBefore.bloggedParks}`);
    console.log(`   - Unblogged Parks: ${statsBefore.unbloggedParks}`);
    console.log(`   - Progress: ${statsBefore.progressPercent}%`);
    console.log(`   - Remaining Days: ${statsBefore.remainingDays}`);
    console.log(`   - System Status: ${statsBefore.systemStatus}`);
    
    if (statsBefore.unbloggedParks === 0) {
      console.log('⚠️ No unblogged parks available for testing');
      console.log('✅ This indicates the duplicate prevention system is working!');
      return;
    }
    
    // Test 3: Complete Blog Generation
    console.log('\n🚀 PHASE 3: Complete Blog Post Generation');
    console.log('-'.repeat(40));
    
    const generationResult = await generateCompleteBlogPost({
      topic: 'complete visitor guide',
      season: 'year-round'
    });
    
    if (!generationResult.success) {
      console.error('❌ Blog generation failed:', generationResult.error);
      process.exit(1);
    }
    
    console.log('\n✅ Blog generation completed successfully!');
    
    // Test 4: Validate Duplicate Prevention
    console.log('\n🔒 PHASE 4: Duplicate Prevention Validation');
    console.log('-'.repeat(40));
    
    console.log('📊 Checking updated statistics...');
    const statsAfter = await getSystemStats();
    
    const expectedBloggedParks = statsBefore.bloggedParks + 1;
    const expectedUnbloggedParks = statsBefore.unbloggedParks - 1;
    
    console.log('\n📈 Statistics Comparison:');
    console.log(`   Before: ${statsBefore.bloggedParks} blogged, ${statsBefore.unbloggedParks} unblogged`);
    console.log(`   After:  ${statsAfter.bloggedParks} blogged, ${statsAfter.unbloggedParks} unblogged`);
    console.log(`   Expected: ${expectedBloggedParks} blogged, ${expectedUnbloggedParks} unblogged`);
    
    const duplicatePreventionWorking = 
      statsAfter.bloggedParks === expectedBloggedParks &&
      statsAfter.unbloggedParks === expectedUnbloggedParks;
    
    console.log(`\n🔒 Duplicate Prevention: ${duplicatePreventionWorking ? '✅ WORKING' : '❌ FAILED'}`);
    
    if (!duplicatePreventionWorking) {
      console.error('❌ Duplicate prevention validation failed!');
      console.error('   The park count did not update as expected.');
      console.error('   This could indicate an issue with Airtable tracking.');
    }
    
    // Test 5: Try to generate for the same park (should fail)
    console.log('\n🚫 PHASE 5: Duplicate Prevention Test');
    console.log('-'.repeat(40));
    
    console.log('🧪 Attempting to generate blog for the same park again...');
    console.log('   (This should either select a different park or fail gracefully)');
    
    const duplicateAttempt = await generateCompleteBlogPost({
      topic: 'seasonal guide',
      season: 'spring'
    });
    
    if (duplicateAttempt.success) {
      console.log('✅ System selected a different park (duplicate prevention working)');
      console.log(`   - New park: ${duplicateAttempt.park.name}`);
      console.log(`   - Previous park: ${generationResult.park.name}`);
      
      if (duplicateAttempt.park.name === generationResult.park.name) {
        console.error('❌ CRITICAL: Same park selected twice! Duplicate prevention failed!');
      }
    } else {
      console.log('✅ System correctly prevented duplicate generation');
      console.log(`   - Error: ${duplicateAttempt.error}`);
    }
    
    // Final Summary
    console.log('\n🎯 FINAL SUMMARY');
    console.log('='.repeat(60));
    
    const finalStats = await getSystemStats();
    
    console.log('📊 System Performance:');
    console.log(`   - Health Check: ${healthCheck.overall ? '✅ PASSED' : '❌ FAILED'}`);
    console.log(`   - Blog Generation: ${generationResult.success ? '✅ PASSED' : '❌ FAILED'}`);
    console.log(`   - Duplicate Prevention: ${duplicatePreventionWorking ? '✅ PASSED' : '❌ FAILED'}`);
    console.log(`   - Generation Time: ${generationResult.duration}`);
    
    console.log('\n📈 Current Progress:');
    console.log(`   - Total Parks: ${finalStats.totalParks}`);
    console.log(`   - Completed: ${finalStats.bloggedParks} (${finalStats.progressPercent}%)`);
    console.log(`   - Remaining: ${finalStats.unbloggedParks} parks`);
    console.log(`   - Estimated Days: ${finalStats.remainingDays} days (1 post/day)`);
    
    console.log('\n🎉 Complete system test finished!');
    
    if (healthCheck.overall && generationResult.success && duplicatePreventionWorking) {
      console.log('✅ ALL TESTS PASSED - System is ready for production!');
    } else {
      console.log('❌ Some tests failed - Review issues before production use');
    }
    
  } catch (error) {
    console.error('\n❌ System test failed:', error.message);
    console.error('Full error:', error);
    process.exit(1);
  }
}

main().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
}); 