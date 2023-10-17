import van from "./mini-van.js"
import common from "./common.ts"
import { HTMLDocument } from "https://deno.land/x/deno_dom@v0.1.38/deno-dom-wasm.ts"

export default (doc: HTMLDocument) => {
  const {tags: {div, p, strong}} = van.vanWithDoc(doc)
  const {ApiTable, Caveat, Demo, H1, H2, H3, Html, InlineJs, Js, JsFile, Link, Shell, Symbol, VanJS, VanX} = common(doc)

  const version = Deno.readTextFileSync("code/van-x.version")

  return div({id: "content"},
    H1(strong("VanX: The 1.0 kB Official VanJS Extension")),
    p(VanX(), " is the official extension of ", VanJS(), ", which provides handy utility functions. With ", VanX(), ", ", VanJS(), " will be more ergonomic for certain use cases and its developer experience will be closer to other popular UI frameworks. Like ", VanJS(), ", ", VanX(), " is also ultra-lightweight, with just 1.0kB in the gzipped minified bundle."),
    H2("Installation"),
    H3("Via NPM"),
    p(VanX(), " is published as NPM package ", Link("https://www.npmjs.com/package/vanjs-ext", "vanjs-ext"), ". Run the following command to install the package:"),
    Shell("npm install vanjs-ext"),
    p("Add this line to your script to import the package:"),
    Js(`import * as vanX from "vanjs-ext"`),
    p("You can also import individual utility functions you're going to use:"),
    Js(`import { <functions you want to use> } from "vanjs-ext"`),
    H3("Via a Script Tag"),
    p("Alternatively, you can import ", VanX(), " from CDN via a ", InlineJs(`<script type="text/javascript">`), " tag:"),
    Html(`<script type="text/javascript" src="https://cdn.jsdelivr.net/npm/vanjs-ext@${version}/dist/van-x.nomodule.min.js"></script>`),
    p(Symbol(`https://cdn.jsdelivr.net/npm/vanjs-ext@${version}/dist/van-x.nomodule.js`)," can be used for the non-minified version."),
    p("Note that: ", VanJS(), " needs to be imported via a ", InlineJs(`<script type="text/javascript">`), " tag for ", VanX, " to work properly."),
    H2(Symbol("vanX.reactive"), ": Reactive Object to Hold Many Individual States"),
    p(Symbol("vanX.reactive"), " provides an ergonomic way to define a single reactive object where each of its individual fields corresponds to an underlying ", Symbol("State"), " object. For instance:"),
    Js(`const data = vanX.reactive({a: 1, b: 2})`),
    p("defines a reactive object with the following underlying state fields:"),
    Js(`{a: van.state(1), b: van.state(2)}`),
    p("The reactive objects defined by ", Symbol("vanX.reactive"), " can be deeply nested. For instance:"),
    Js(`const data = vanX.reactive({
  a: 1,
  b: {
    c: 2,
    d: 3,
  },
})`),
    p("defines a reactive object with the following underlying state fields:"),
    Js(`{
  a: van.state(1),
  b: van.state({
    c: van.state(2),
    d: van.state(3),
  }),
}`),
    p("Getting and setting values of the underlying states can be simply done by getting / setting the fields of the reactive object. For instance, ", InlineJs(`data.b.c`), " is equivalent to what you would have to write ", InlineJs(`data.b.val.c.val`), " had the underlying state object been accessed."),
    H3("A practical example"),
    p("Now, let's take a look at a practice example on how ", Symbol("vanX.reactive"), " can help group multiple states into a single reactive object in your application:"),
    JsFile("name.code.js"),
    p(Demo()),
    p({id: "demo-name"}),
    p({
      id: "jsfiddle-name",
      "data-details": "demo-van-x.details",
      "data-prefix": "const {button, div, input} = van.tags",
      "data-suffix": "van.add(document.body, Name())",
    }),
    p("Note that, you can set the entire object of the ", Symbol("name"), " field, in addition to setting each of individual leaf fields, as what's being done in the ", Symbol("onclick"), " handler of the ", Symbol("Reset"), " button:"),
    Js(`button({onclick: () => data.name = {first: "Tao", last: "Xin"}}, "Reset")`),
    p(Caveat(), "Accessing to any sub-field of the reactive object needs to be wrapped inside a binding function. Otherwise, your app won't be reactive to the sub-field changes."),
    p({id: "caveat-no-aliasing"}, Caveat(), "DO NOT alias any sub-field of the reactive object into other variables. Doing so will break the dependency detection when the sub-field alias is used in a binding function."),
    H3("Calculated fields"),
    p("You can specify calculated fields (similar to ", Link("derived states", "/tutorial#derived-state"), " in ", VanJS(), ") with ", Symbol("vanX.calc"), ". The example above can be rewritten to the code below:"),
    JsFile("name-calc.code.js"),
    p(Demo()),
    p({id: "demo-name-calc"}),
    p({
      id: "jsfiddle-name-calc",
      "data-details": "demo-van-x.details",
      "data-prefix": "const {button, div, input} = van.tags",
      "data-suffix": "van.add(document.body, Name())",
    }),
    p(Caveat(), "Avoid self-referencing when specify calculated fields. For instance, the code below:"),
    Js(`const data = vanX.reactive({
  name: {first: "Tao", last: "Xin"},
  fullName: vanX.calc(() => \`\${data.name.first} \${data.name.last}\`),
})`),
    p("will lead to ", Symbol("ReferenceError"), " as ", Symbol("data"), " variable is not yet defined when the calculation function is being executed."),
    p("You can either insert the new calculated fields after the reactive object is built (like what's done in the example above), or defining all the calculated fields in a separate reactive object."),
    H3("Get the underlying ", Symbol("State"), " object"),
    p("Sometimes, it could be handy to get the underlying ", Symbol("State"), " object for fields in a reactive object. This can be achieved with ", Symbol("vanX.stateFields"), ". The example above can be modified to use underlying state field instead of the binding function for ", Symbol("Full name"), ":"),
    JsFile("name-state-fields.code.js"),
    p(Demo()),
    p({id: "demo-name-state-fields"}),
    p({
      id: "jsfiddle-name-state-fields",
      "data-details": "demo-van-x.details",
      "data-prefix": "const {button, div, input} = van.tags",
      "data-suffix": "van.add(document.body, Name())",
    }),
    p("Note that, ", Symbol("stateFields"), " only gets the underlying state fields for one layer of the reactive object. For instance, to get the state field for ", Symbol("First name"), ", you need to write:"),
    Js(`vanX.stateFields(vanX.stateFields(data).name.val).first`),
    H3("Add reactivity to existing JavaScript classes"),
    p("It's possible to add reactivity to objects of existing JavaScript classes with the help of ", Symbol("vanX.reactive"), ". For instance, the code below adds the reactivity to a ", Symbol("Person"), "object:"),
    JsFile("name-existing-class.code.js"),
    p(Demo()),
    p({id: "demo-name-existing-class"}),
    p({
      id: "jsfiddle-name-existing-class",
      "data-details": "demo-van-x.details",
      "data-prefix": "const {button, div, input} = van.tags",
      "data-suffix": "van.add(document.body, Name())",
    }),
    p(Caveat(), "Once an object is turned reactive with ", Symbol("vanX.reactive"), ", you shouldn't access the original object anymore. Doing so will create the same issue as ", Link("aliasing", "#caveat-no-aliasing"), "."),
    H3({id: "api-reactivity"}, "API reference: ", Symbol("vanX.reactive")),
    ApiTable({
      signature: "vanX.reactive(obj) => <the created reactive object>",
      description: ["Convert the input object ", Symbol("obj"), " into a reactive object."],
      parameters: {
        obj: ["Can be a plain object or an object of an existing JavaScript class. ", Symbol("obj"), " can have deeply nested fields. ", Symbol("obj"), " shouldn't be accessed anymore after the ", InlineJs("vanX.reactive(obj)"), " call."],
      },
      returns: "The created reactive object.",
    })
  )
}
