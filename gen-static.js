const { createServer } = require("vite")
const reactPlugin = require("@vitejs/plugin-react")
const path = require("node:path")
const fs = require("node:fs")

async function genStatic(url) {
    const vite = await createServer({
        // tell vite to properly parse React code
        plugins: [reactPlugin()],
        // prevent vite from starting as a webserver, among other things
        appType: "custom",
    })

    // import our server entry's render method
    // this also adds the polyfills (and other dependencies/optimizations)
    const { render } = await vite.ssrLoadModule("/src/entry-server.jsx")

    // load our default index.html file from the build directory
    const toBuildPath = pathPart => path.join(process.cwd(), "build", pathPart)
    const indexHtmlContent = fs.readFileSync(toBuildPath("index.html")).toString()

    // now we create our DOM markup
    const urlHtmlMarkup = render(url)

    // make sure to add your rendered content as a child of the client entry's render target
    // in the default case that's the div with id="root"
    const urlHtmlContent = indexHtmlContent.replace('<div id="root"></div>', `<div id="root">${urlHtmlMarkup}</div>`)

    // finally, write the file to your build directory
    // omitting the suffix can be done, depending on your webserver's configuration
    fs.writeFileSync(toBuildPath(url + ".html"), urlHtmlContent)

    // shutdown vite
    await vite.close()
}

const urls = ["/generate-me"]

urls.map(genStatic)
