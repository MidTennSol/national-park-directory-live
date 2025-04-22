/**
 * Simple Markdown-to-HTML parser
 * This is a lightweight client-side solution with no dependencies
 */

class MarkdownPreview {
  constructor(editor, preview) {
    this.editor = editor;
    this.preview = preview;
    this.frontmatterVisible = false;
    this.setupListeners();
  }

  setupListeners() {
    if (!this.editor || !this.preview) return;
    
    this.editor.addEventListener('input', () => {
      this.updatePreview();
    });
    
    // Initial render with a slight delay to ensure DOM is ready
    setTimeout(() => {
      this.updatePreview();
    }, 100);
  }

  updatePreview() {
    if (!this.editor || !this.preview) return;
    
    const markdown = this.editor.value || '';
    const html = this.parseMarkdown(markdown);
    this.preview.innerHTML = html || '<div class="text-gray-400 italic p-4">Preview will appear here as you type...</div>';
    
    // Apply syntax highlighting to code blocks
    this.preview.querySelectorAll('pre code').forEach(block => {
      block.classList.add('bg-gray-800', 'text-gray-100', 'p-4', 'rounded', 'block', 'overflow-x-auto');
    });
  }

  parseMarkdown(text) {
    if (!text) return '';
    
    // First, handle frontmatter
    let content = text;
    let frontmatterHtml = '';
    
    if (content.startsWith('---')) {
      const endOfFrontmatter = content.indexOf('---', 3);
      if (endOfFrontmatter !== -1) {
        const frontmatter = content.substring(3, endOfFrontmatter);
        content = content.substring(endOfFrontmatter + 3);
        
        if (this.frontmatterVisible) {
          frontmatterHtml = `
            <div class="bg-gray-100 p-4 rounded-lg mb-6 font-mono text-sm">
              <h3 class="text-gray-700 font-semibold mb-2">Frontmatter</h3>
              <pre>${this.escapeHtml(frontmatter)}</pre>
            </div>
          `;
        }
      }
    }

    // Process the main content with markdown rules
    let html = this.processMarkdown(content);
    
    return frontmatterHtml + html;
  }

  processMarkdown(text) {
    let html = text;

    // Handle code blocks (```)
    html = html.replace(/```([a-z]*)\n([\s\S]*?)\n```/g, (match, language, code) => {
      return `<pre><code class="language-${language}">${this.escapeHtml(code)}</code></pre>`;
    });

    // Handle inline code (`)
    html = html.replace(/`([^`]+)`/g, '<code class="bg-gray-100 text-red-600 px-1 py-0.5 rounded text-sm">$1</code>');

    // Handle headers
    html = html.replace(/^# (.*$)/gm, '<h1 class="text-3xl font-bold mt-6 mb-4">$1</h1>');
    html = html.replace(/^## (.*$)/gm, '<h2 class="text-2xl font-bold mt-5 mb-3">$1</h2>');
    html = html.replace(/^### (.*$)/gm, '<h3 class="text-xl font-bold mt-4 mb-2">$1</h3>');
    html = html.replace(/^#### (.*$)/gm, '<h4 class="text-lg font-bold mt-3 mb-1">$1</h4>');

    // Handle bold text
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

    // Handle italic text
    html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');

    // Handle links
    html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-blue-600 hover:underline">$1</a>');

    // Handle images
    html = html.replace(/!\[([^\]]+)\]\(([^)]+)\)/g, (match, alt, src) => {
      // If it's a blog image that should be in public, show a nice preview
      if (src.startsWith('/images/blog/')) {
        return `
          <figure class="my-4">
            <img src="${src}" alt="${alt}" class="rounded-lg shadow-md max-w-full" 
              onerror="this.onerror=null; this.src='/images/park-placeholder.svg'; this.classList.add('border', 'border-red-300'); this.nextElementSibling.innerHTML += '<span class=\\'text-red-500\\'>Image not found. Please check the path.</span>';" />
            <figcaption class="text-sm text-gray-600 mt-2">${alt}</figcaption>
          </figure>
        `;
      }
      return `<img src="${src}" alt="${alt}" class="max-w-full my-4 rounded" />`;
    });

    // Handle horizontal rules - make sure to not conflict with frontmatter
    html = html.replace(/^---$/gm, '<hr class="my-6 border-t-2 border-gray-200">');

    // Handle unordered lists
    let inList = false;
    const listLines = html.split('\n').map(line => {
      if (line.trim().startsWith('- ')) {
        const content = line.trim().substring(2);
        if (!inList) {
          inList = true;
          return `<ul class="list-disc pl-6 my-4"><li>${content}</li>`;
        }
        return `<li>${content}</li>`;
      } else if (inList && !line.trim().startsWith('- ') && line.trim() !== '') {
        inList = false;
        return `</ul>\n${line}`;
      }
      return line;
    });
    
    if (inList) {
      listLines.push('</ul>');
    }
    
    html = listLines.join('\n');

    // Handle ordered lists
    inList = false;
    const orderedListLines = html.split('\n').map(line => {
      if (/^\d+\.\s+/.test(line.trim())) {
        const content = line.trim().replace(/^\d+\.\s+/, '');
        if (!inList) {
          inList = true;
          return `<ol class="list-decimal pl-6 my-4"><li>${content}</li>`;
        }
        return `<li>${content}</li>`;
      } else if (inList && !/^\d+\.\s+/.test(line.trim()) && line.trim() !== '') {
        inList = false;
        return `</ol>\n${line}`;
      }
      return line;
    });
    
    if (inList) {
      orderedListLines.push('</ol>');
    }
    
    html = orderedListLines.join('\n');

    // Handle paragraphs (must come last)
    html = html.split('\n\n').map(paragraph => {
      if (
        paragraph.trim() !== '' && 
        !paragraph.trim().startsWith('<h') && 
        !paragraph.trim().startsWith('<ul') && 
        !paragraph.trim().startsWith('<ol') && 
        !paragraph.trim().startsWith('<pre') && 
        !paragraph.trim().startsWith('<hr') && 
        !paragraph.trim().startsWith('<figure') &&
        !paragraph.trim().startsWith('</ol') &&
        !paragraph.trim().startsWith('</ul')
      ) {
        return `<p class="my-3 leading-relaxed">${paragraph}</p>`;
      }
      return paragraph;
    }).join('\n\n');

    return html;
  }

  toggleFrontmatter() {
    this.frontmatterVisible = !this.frontmatterVisible;
    this.updatePreview();
  }

  escapeHtml(text) {
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  const editor = document.getElementById('markdown-editor');
  const preview = document.getElementById('markdown-preview');
  const toggleBtn = document.getElementById('toggle-frontmatter');
  
  if (editor && preview) {
    console.log('Initializing markdown preview');
    const markdownPreview = new MarkdownPreview(editor, preview);
    
    // Manually trigger initial preview for any saved content
    const savedContent = localStorage.getItem('blog-markdown-content');
    if (savedContent && editor.value === '') {
      editor.value = savedContent;
      const event = new Event('input');
      editor.dispatchEvent(event);
    }
    
    // Handle frontmatter toggle if button exists
    if (toggleBtn) {
      toggleBtn.addEventListener('click', () => {
        markdownPreview.toggleFrontmatter();
        toggleBtn.textContent = markdownPreview.frontmatterVisible 
          ? 'Hide Frontmatter' 
          : 'Show Frontmatter';
      });
    }
  } else {
    console.warn('Markdown editor or preview elements not found');
  }
}); 