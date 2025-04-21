# National Park Directory

A comprehensive web directory of US National Parks, Monuments, Historic Sites, and other National Park Service managed areas.

## Features

- Browse parks by state
- Explore different types of park designations
- View detailed information about each park
- Responsive design for all device sizes
- Built with Astro and TailwindCSS

## Data Source

The park data is sourced from Airtable, containing information about National Parks, Monuments, Historic Sites, Recreation Areas, and more.

## Getting Started

### Prerequisites

- Node.js (v16 or later)
- npm or yarn

### Installation

1. Clone the repository
```
git clone https://github.com/yourusername/national-park-directory.git
cd national-park-directory
```

2. Install dependencies
```
npm install
```

3. Create a `.env` file in the root directory with your Airtable credentials:
```
AIRTABLE_API_KEY=your_airtable_api_key
AIRTABLE_BASE_ID=your_airtable_base_id
```

4. Start the development server
```
npm run dev
```

5. Open your browser and navigate to `http://localhost:3000`

## Building for Production

To create a production build:

```
npm run build
```

The built files will be in the `dist` directory.

## Technologies Used

- [Astro](https://astro.build) - The web framework
- [TailwindCSS](https://tailwindcss.com) - For styling
- [Airtable](https://airtable.com) - Data source

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Data provided by the National Park Service
- Images sourced from Wikimedia Commons and the National Park Service

```sh
npm create astro@latest -- --template minimal
```

[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/github/withastro/astro/tree/latest/examples/minimal)
[![Open with CodeSandbox](https://assets.codesandbox.io/github/button-edit-lime.svg)](https://codesandbox.io/p/sandbox/github/withastro/astro/tree/latest/examples/minimal)
[![Open in GitHub Codespaces](https://github.com/codespaces/badge.svg)](https://codespaces.new/withastro/astro?devcontainer_path=.devcontainer/minimal/devcontainer.json)

> 🧑‍🚀 **Seasoned astronaut?** Delete this file. Have fun!

## 🚀 Project Structure

Inside of your Astro project, you'll see the following folders and files:

```text
/
├── public/
├── src/
│   └── pages/
│       └── index.astro
└── package.json
```

Astro looks for `.astro` or `.md` files in the `src/pages/` directory. Each page is exposed as a route based on its file name.

There's nothing special about `src/components/`, but that's where we like to put any Astro/React/Vue/Svelte/Preact components.

Any static assets, like images, can be placed in the `public/` directory.

## 🧞 Commands

All commands are run from the root of the project, from a terminal:

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `npm install`             | Installs dependencies                            |
| `npm run dev`             | Starts local dev server at `localhost:4321`      |
| `npm run build`           | Build your production site to `./dist/`          |
| `npm run preview`         | Preview your build locally, before deploying     |
| `npm run astro ...`       | Run CLI commands like `astro add`, `astro check` |
| `npm run astro -- --help` | Get help using the Astro CLI                     |

## 👀 Want to learn more?

Feel free to check [our documentation](https://docs.astro.build) or jump into our [Discord server](https://astro.build/chat).
