import van from "./mini-van.js"
import common from "./common.ts"
import { HTMLDocument } from "https://deno.land/x/deno_dom@v0.1.38/deno-dom-wasm.ts"

export default (doc: HTMLDocument) => {
  const {tags} = van.vanWithDoc(doc)
  const {a, div, p, path, svg, table, tbody, th, thead, tr} = tags

  const {BI, Download, DownloadRow, H1, H2, H3, Html, Js, Link, MiniVan, Symbol, SymLink, Ts, VanJS} = common(doc)

  const version = Deno.readTextFileSync("code/mini-van.version")

  const DownloadTable = ({version}: {version: string}) => table({class: "download-table"},
    thead(tr(th("Files"), th("Description"))),
    tbody(
      DownloadRow({
        version,
        prefix: "mini-",
        suffix: ".min",
        hasDts: true,
        description: "Minized script file for ES6 modules, optimized for bundle size.",
      }),
      DownloadRow({
        version,
        prefix: "mini-",
        suffix: "",
        hasDts: true,
        description: "The source file without minification.",
      }),
      DownloadRow({
        version,
        suffix: ".nomodule.min",
        hasDts: false,
        description: ["Similar to ", Symbol(`mini-van-${version}.min.js`), ", but designed to work in non-module context, such as inline JavaScript or ", Symbol('<script type="text/javascript">'), "."],
      }),
      DownloadRow({
        version,
        suffix: ".nomodule",
        hasDts: false,
        description: ["Similar to ", Symbol(`mini-van-${version}.js`), ", but designed to work in non-module context, such as inline JavaScript or ", Symbol('<script type="text/javascript">'), "."],
      }),
    ),
  )

  return div({id: "content"},
    H1(MiniVan(), ": A Minimalist Template Engine for DOM Generation, working for both Client-side and Server-side Rendering"),
    p(MiniVan(), " is an ", BI("ultra-lightweight"), " template engine for DOM composition and manipulation. With only 0.5kB in the minized bundle size, ", MiniVan(), " enables you to build comprehensive UI with elegant and expressive vanilla JavaScript code:"),
    Js(`// Reusable components can be just pure vanilla JavaScript functions.
// Here we capitalize the first letter to follow React conventions.
const Hello = () => div(
  p("👋Hello"),
  ul(
    li("🗺️World"),
    li(a({href: "https://vanjs.org/"}, "🍦VanJS")),
  ),
)

van.add(document.body, Hello())
// Alternatively, you can write:
// document.body.appendChild(Hello())
`),
    p({
      id: "jsfiddle-hello",
      "data-prefix": "const {a, div, li, p, ul} = van.tags",
      "data-details": "demo-mini-van.details",
    }),
    p("You can convert any HTML snippet into ", MiniVan(), " code with our online ", Link("converter", "/convert"), "."),
    p(MiniVan(), " is the slimmed-down version of ", Link(VanJS(), "/"), ", which aims to provide an ", BI("ultra-lightweight"), ", ", BI("zero-dependency"), ", and ", BI("unopinionated"), " Reactive UI framework based on pure vanilla JavaScript and DOM. Compared to ", VanJS(), ", ", MiniVan(), " further reduces the bundle size to 0.5kB and can be used on the server-side as a ", Link("template engine", "https://en.wikipedia.org/wiki/Web_template_system"), "."),
    H2("Server-Side: Deno Integration"),
    p(MiniVan(), " can be used on the server side as a template engine to render dynamic web content for HTTP servers. If you use Deno, the integration is fairly straightforward."),
    p("There are 2 modes for server-side integration: ", Symbol("van-plate"), " mode (based on text templating, thus doesn't need the DOM dependency), and ", Symbol("mini-van"), " mode (based on DOM, thus needs the DOM dependency)."),
    H3(Symbol("van-plate"), " mode"),
    p("In ", Symbol("van-plate"), " mode, HTML content is generated purely through text templating. It can be easily integrated with your HTTP server to render dynamic web content. See the sample code below:"),
    Ts(`import { serve } from "https://deno.land/std@0.184.0/http/server.ts"
import van from "https://deno.land/x/minivan@${version}/src/van-plate.js"

const {a, body, li, p, ul} = van.tags

const port = 8080

console.log("Testing DOM rendering...")
// Expecting \`<a href="https://vanjs.org/">🍦VanJS</a>\` in the console
console.log(a({href: "https://vanjs.org/"}, "🍦VanJS").render())

console.log(\`HTTP webserver running. Access it at: http://localhost:\${port}/\`)
await serve(req => new Response(
  van.html(
    body(
      p("Your user-agent is: ", req.headers.get("user-agent") ?? "Unknown"),
      p("👋Hello"),
      ul(
        li("🗺️World"),
        li(a({href: "https://vanjs.org/"}, "🍦VanJS")),
      ),
    ),
  ),
  {
    status: 200,
    headers: {"content-type": "text/html; charset=utf-8"},
  },
), {port})
`),
    p("As illustrated in the example, ", Symbol("render"), " method can be called on the object returned from the ", SymLink("tag function", "/tutorial#api-tags"), " to generate a ", Symbol("string"), " that can be   used for serving."),
    p(Symbol("van.html"), " is a helper function defined in ", Symbol("van-plate.js"), " that is equivalent to:",
    Js(`(...args) => "<!DOCTYPE html>" + tags.html(...args).render()`)),
    H3(Symbol("mini-van"), " mode"),
    p("The behavior in ", Symbol("mini-van"), " mode is similar to the behavior in browser context. i.e.: DOM objects will be created by ", SymLink("tag functions", "/tutorial#api-tags"), ". As Deno doesn't have the built-in support for DOM objects, you need to provide a 3rd-party ", Symbol("Document"), " object before integrating with ", MiniVan(), " in this mode."),
    p("There are multiple 3rd-party options for the ", Symbol("Document"), " object. In the example below, we will demonstrate the integration with the help of ", Link("deno-dom", "https://deno.com/manual@v1.28.1/advanced/jsx_dom/deno_dom"), ":"),
    Ts(`import { serve } from "https://deno.land/std@0.184.0/http/server.ts"
import { DOMParser } from "https://deno.land/x/deno_dom@v0.1.38/deno-dom-wasm.ts"
import van from "https://deno.land/x/minivan@${version}/src/mini-van.js"

const document = new DOMParser().parseFromString("", "text/html")!
const {tags, html} = van.vanWithDoc(document)
const {a, body, li, p, ul} = tags

const port = 8080

console.log("Testing DOM rendering...")
const anchorDom = a({href: "https://vanjs.org/"}, "🍦VanJS")
// anchorDom is an HTMLAnchorElement
// Expecting \`<a href="https://vanjs.org/">🍦VanJS</a>\` printed in the console
console.log(anchorDom.outerHTML)

console.log(\`HTTP webserver running. Access it at: http://localhost:\${port}/\`)
await serve(req => new Response(
  html(
    body(
      p("Your user-agent is: ", req.headers.get("user-agent") ?? "Unknown"),
      p("👋Hello"),
      ul(
        li("🗺️World"),
        li(a({href: "https://vanjs.org/"}, "🍦VanJS")),
      ),
    ),
  ),
  {
    status: 200,
    headers: {"content-type": "text/html; charset=utf-8"},
  },
), {port})
`),
    p("Similar to ", Symbol("van-plate"), " mode, we have a helper function ", Symbol("html"), " defined in ", Symbol("mini-van.js"), " which is equivalent to:"),
    Js(`(...args) => "<!DOCTYPE html>" + tags.html(...args).outerHTML`),
    H2("Client-Side: Getting Started"),
    p("To get started on the client side, download the latest version ", Download(`mini-van-${version}.min.js`), " and add the line below to your script:"),
    Js(`import van from "./mini-van-${version}.min.js"`),
    p("To code without ES6 modules, you can download the bundled version ", Download(`mini-van-${version}.nomodule.min.js`), " and add the following line to your HTML file instead:"),
    Html(`<script type="text/javascript" src="mini-van-${version}.nomodule.min.js"></script>`),
    H3("Download Table"),
    p("You can find all relevant ", MiniVan(), " files to download in the table below:"),
    DownloadTable({version}),
    H2("API Reference"),
    p(MiniVan(), " exposes the same set of APIs as ", VanJS(), " for DOM composition and manipulation. Thus for API reference, you can refer to ", Link("DOM Composition and Manipulation", "/tutorial#dom"), " section of ", VanJS(), " tutorial. Note that: state and state binding are not supported in ", MiniVan(), "."),
    H2("Source Code"),
    p({style: "display: flex; align-items: center;"},
      svg({height: "16", "aria-hidden": "true", viewBox: "0 0 16 16", version: "1.1", width: "16", "data-view-component": "true", class: "octicon octicon-mark-github v-align-middle", style: "margin-right: 6px;"},
        path({"d": "M8 0c4.42 0 8 3.58 8 8a8.013 8.013 0 0 1-5.45 7.59c-.4.08-.55-.17-.55-.38 0-.27.01-1.13.01-2.2 0-.75-.25-1.23-.54-1.48 1.78-.2 3.65-.88 3.65-3.95 0-.88-.31-1.59-.82-2.15.08-.2.36-1.02-.08-2.12 0 0-.67-.22-2.2.82-.64-.18-1.32-.27-2-.27-.68 0-1.36.09-2 .27-1.53-1.03-2.2-.82-2.2-.82-.44 1.1-.16 1.92-.08 2.12-.51.56-.82 1.28-.82 2.15 0 3.06 1.86 3.75 3.64 3.95-.23.2-.44.55-.51 1.07-.46.21-1.61.55-2.33-.66-.15-.24-.6-.83-1.23-.82-.67.01-.27.38.01.53.34.19.73.9.82 1.13.16.45.68 1.31 2.69.94 0 .67.01 1.3.01 1.49 0 .21-.15.45-.55.38A7.995 7.995 0 0 1 0 8c0-4.42 3.58-8 8-8Z"}),
      ),
      Link("github.com/vanjs-org/mini-van", "https://github.com/vanjs-org/mini-van"),
    ),
    H2("Support & Feedback"),
    p(
      a({class: "github-button", href: "https://github.com/vanjs-org/mini-van", "data-icon": "octicon-star", "aria-label": "Star vanjs-org/van on GitHub"},
        "Star",
      ), " ",
      a({class: "github-button", href: "https://github.com/vanjs-org/mini-van/subscription", "data-icon": "octicon-eye", "aria-label": "Watch vanjs-org/van on GitHub"},
        "Watch",
      ), " ",
      a({class: "github-button", href: "https://github.com/vanjs-org/mini-van/issues", "data-icon": "octicon-issue-opened", "aria-label": "Issue vanjs-org/van on GitHub"},
        "Issue",
      ),
    ),
    p("Contact us: ", Link("tao@vanjs.org", "mailto:tao@vanjs.org")),
  )
}
