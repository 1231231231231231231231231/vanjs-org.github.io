import van from "/code/van-latest.min.js"

const {a, b, button, div, i, input, label, li, p, pre, span, strike, table, tbody, td, textarea, th, thead, tr, ul} = van.tags

{
  const Hello = () => div(
    p("👋Hello"),
    ul(
      li("🗺️World"),
      li(a({href: "https://vanjs.org/"}, "🍦VanJS")),
    ),
  )

  van.add(document.getElementById("demo-hello"), Hello())
}

{
  const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))

  const Run = ({sleepMs}) => {
    const headingSpaces = van.state(40), trailingUnderscores = van.state(0)

    const animate = async () => {
      while (headingSpaces.val > 0) {
        await sleep(sleepMs)
        --headingSpaces.val, ++trailingUnderscores.val
      }
    }
    animate()

    return pre(() =>
      `${" ".repeat(headingSpaces.val)}🚐💨Hello VanJS!${"_".repeat(trailingUnderscores.val)}`)
  }

  const Hello = () => {
    const dom = div()
    return div(
      dom,
      button({onclick: () => van.add(dom, Run({sleepMs: 2000}))}, "Hello 🐌"),
      button({onclick: () => van.add(dom, Run({sleepMs: 500}))}, "Hello 🐢"),
      button({onclick: () => van.add(dom, Run({sleepMs: 100}))}, "Hello 🚶‍♂️"),
      button({onclick: () => van.add(dom, Run({sleepMs: 10}))}, "Hello 🏎️"),
      button({onclick: () => van.add(dom, Run({sleepMs: 2}))}, "Hello 🚀"),
    )
  }

  van.add(document.getElementById("demo-hello-fun"), Hello())
}

{
  const StaticDom = () => {
    const dom = div(
      div(
        button("Dummy Button"),
        button(
          {onclick: () =>
            van.add(dom,
              div(button("New Button")),
              div(a({href: "https://www.example.com/"}, "This is a link")),
            )
          },
          "Button to Add More Elements"),
        button({onclick: () => alert("Hello from VanJS")}, "Hello"),
      ),
    )
    return dom
  }

  van.add(document.getElementById("demo-static"), StaticDom())
}

{
  const Counter = () => {
    const counter = van.state(0)
    return span(
      "❤️ ", counter, " ",
      button({onclick: () => ++counter.val}, "👍"),
      button({onclick: () => --counter.val}, "👎"),
    )
  }

  van.add(document.getElementById("demo-counter-simple"), Counter())
}

{
  const buttonStyleList = [
    ["👆", "👇"],
    ["👍", "👎"],
    ["🔼", "🔽"],
    ["⬆️", "⬇️"],
    ["⏫", "⏬"],
    ["📈", "📉"],
  ]

  const Counter = ({buttons}) => {
    const counter = van.state(0)
    const dom = div(
      "❤️ ", counter, " ",
      button({onclick: () => ++counter.val}, buttons[0]),
      button({onclick: () => --counter.val}, buttons[1]),
      button({onclick: () => dom.remove()}, "❌"),
    )
    return dom
  }

  const CounterSet = () => {
    const containerDom = div()
    return div(
      containerDom,
      button({onclick: () => van.add(containerDom,
        Counter({buttons: buttonStyleList[Math.floor(Math.random() * buttonStyleList.length)]}))},
        "➕",
      ),
    )
  }

  van.add(document.getElementById("demo-counter-advanced"), CounterSet())
}

{
  const {button, pre, span} = van.tags

  const Stopwatch = () => {
    const elapsed = van.state(0)
    let id
    const start = () => id = id || setInterval(() => elapsed.val += .01, 10)
    return span(
      pre({style: "display: inline;"}, () => elapsed.val.toFixed(2), "s "),
      button({onclick: start}, "Start"),
      button({onclick: () => (clearInterval(id), id = 0)}, "Stop"),
      button({onclick: () => (clearInterval(id), id = 0, elapsed.val = 0)}, "Reset"),
    )
  }

  van.add(document.getElementById("demo-stopwatch"), Stopwatch())
}

{
  const TodoItem = ({text}) => div(
    input({type: "checkbox", onchange: e =>
      e.target.closest("div").querySelector("span").style["text-decoration"] =
        e.target.checked ? "line-through" : ""
    }),
    span(text),
    a({onclick: e => e.target.closest("div").remove()}, "❌"),
  )

  const TodoList = () => {
    const inputDom = input({type: "text"})
    const dom = div(
      inputDom,
      button({onclick: () => van.add(dom, TodoItem({text: inputDom.value}))}, "Add"),
    )
    return dom
  }

  van.add(document.getElementById("demo-todo-procedural"), TodoList())
}

{
  const TodoItem = ({text}) => {
    const done = van.state(false), deleted = van.state(false)
    return () => deleted.val ? null : div(
      input({type: "checkbox", checked: done, onclick: e => done.val = e.target.checked}),
      () => (done.val ? strike : span)(text),
      a({onclick: () => deleted.val = true}, "❌"),
    )
  }

  const TodoList = () => {
    const inputDom = input({type: "text"})
    const dom = div(
      inputDom,
      button({onclick: () => van.add(dom, TodoItem({text: inputDom.value}))}, "Add"),
    )
    return dom
  }

  van.add(document.getElementById("demo-todo-functional"), TodoList())
}

{
  class TodoItemState {
    text;
    done;
    deleted;
    constructor(text, done, deleted) {
        this.text = text;
        this.done = done;
        this.deleted = deleted;
    }
    serialize() { return { text: this.text, done: this.done.val }; }
  }
  const TodoItem = ({ text, done, deleted }) => () => deleted.val ? null : div(input({ type: "checkbox", checked: done, onclick: e => done.val = e.target.checked }), () => (done.val ? strike : span)(text), a({ onclick: () => deleted.val = true }, "❌"));
  class TodoListState {
      todos;
      constructor(todos) {
          this.todos = todos;
      }
      save() {
          localStorage.setItem("appState", JSON.stringify((this.todos = this.todos.filter(t => !t.deleted.val)).map(t => t.serialize())));
      }
      static load = () => new TodoListState(JSON.parse(localStorage.getItem("appState") ?? "[]")
          .map((t) => new TodoItemState(t.text, van.state(t.done), van.state(false))));
      add(text) {
          this.todos.push(new TodoItemState(text, van.state(false), van.state(false)));
          return new TodoListState(this.todos);
      }
  }
  const TodoList = () => {
      const appState = van.state(TodoListState.load());
      van.derive(() => appState.val.save());
      const inputDom = input({ type: "text" });
      return div(inputDom, button({ onclick: () => appState.val = appState.val.add(inputDom.value) }, "Add"), (dom) => {
          if (!dom)
              return div(appState.val.todos.map(TodoItem));
          const newItem = appState.val.todos.at(-1);
          van.add(dom, TodoItem(newItem));
          van.derive(() => (newItem.done.val, newItem.deleted.val,
              requestIdleCallback(() => appState.val.save())));
          return dom;
      });
  };
  van.add(document.getElementById("demo-todo-fully-reactive"), TodoList());
}

{
  const tsToDate = ts =>
    ts < 1e10 ? new Date(ts * 1e3) :
    ts < 1e13 ? new Date(ts) :
    ts < 1e16 ? new Date(ts / 1e3) :
    new Date(ts / 1e6)

  const Converter = () => {
    const nowTs = van.state(Math.floor(new Date().getTime() / 1e3)), date = van.state(null)
    setInterval(() => ++nowTs.val, 1000)
    const inputDom = input({type: "text", size: 25, value: nowTs.val})
    return div(
      div(b("Now: "), nowTs),
      inputDom, " ",
      button({onclick: () => date.val = tsToDate(Number(inputDom.value))}, "Convert"),
      p(i("Supports Unix timestamps in seconds, milliseconds, microseconds and nanoseconds.")),
      () => date.val ? p(
        div(date.val.toString()),
        div(b("GMT: "), date.val.toGMTString()),
      ) : p(),
    )
  }

  van.add(document.getElementById("demo-epoch-converter"), Converter())
}

{
  const Label = text => span({class: "label"}, text)
  const Value = text => span({class: "value"}, text)

  const Inspector = () => {
    const keyEvent = van.state(new KeyboardEvent("keydown"))

    const Result = prop => span(Label(prop + ": "), Value(() => keyEvent.val[prop]))

    return div(
      div(input({placeholder: "Focus here and press keys…", style: "width: 260px",
        onkeydown: e => (e.preventDefault(), keyEvent.val = e)})),
      div(Result("key"), Result("code"), Result("which"), Result("keyCode")),
      div(Result("ctrlKey"), Result("metaKey"), Result("altKey"), Result("shiftKey")),
    )
  }

  van.add(document.getElementById("demo-key-inspector"), Inspector())
}

{
  const setCalculatorHeight = () => {
    const calculatorDom = document.getElementById("demo-calculator")
    calculatorDom.style.height = calculatorDom.clientWidth * (4 / 3) + "px"
  }
  addEventListener("resize", setCalculatorHeight)
  setCalculatorHeight()
}

{
  const TableViewer = ({inputText, inputType}) => {
    const jsonRadioDom = input({type: "radio", checked: inputType === "json",
      name: "inputType", value: "json"})
    const csvRadioDom = input({type: "radio", checked: inputType === "csv",
      name: "inputType", value: "csv"})
    const autoGrow = e => {
      e.style.height = "5px"
      e.style.height = (e.scrollHeight + 5) + "px"
    }
    const textareaDom = textarea({oninput: e => autoGrow(e.target)}, inputText)
    setTimeout(() => autoGrow(textareaDom), 10)

    const text = van.state("")

    const tableFromJson = text => {
      const json = JSON.parse(text), head = Object.keys(json[0])
      return {
        head,
        data: json.map(row => head.map(h => row[h]))
      }
    }

    const tableFromCsv = text => {
      const lines = text.split("\n").filter(l => l.length > 0)
      return {
        head: lines[0].split(","),
        data: lines.slice(1).map(l => l.split(",")),
      }
    }

    return div(
      div(jsonRadioDom, label("JSON"), csvRadioDom, label("CSV (Quoting not Supported)")),
      div(textareaDom),
      div(button({onclick: () => text.val = textareaDom.value}, "Show Table")),
      p(() => {
        if (!text.val) return div()
        try {
          const {head, data} = (jsonRadioDom.checked ? tableFromJson : tableFromCsv)(text.val)
          return table(
            thead(tr(head.map(h => th(h)))),
            tbody(data.map(row => tr(row.map(col => td(col))))),
          )
        } catch (e) {
          return pre({class: "err"}, e.toString())
        }
      }),
    )
  }

  van.add(document.getElementById("demo-table-viewer"), TableViewer({
    inputText: `[{"id":1,"name":"John Doe","email":"john.doe@example.com","age":35,"country":"USA"},{"id":2,"name":"Jane Smith","email":"jane.smith@example.com","age":28,"country":"Canada"},{"id":3,"name":"Bob Johnson","email":"bob.johnson@example.com","age":42,"country":"Australia"}]`,
    inputType: "json",
  }))
}

{
  const ListItem = ({key, value, indent = 0}) => {
    const hide = van.state(key !== "")
    const valueDom = typeof value !== "object" ? value : div(
      {style: () => hide.val ? "display: none;" : ""},
      Object.entries(value).map(([k, v]) =>
        ListItem({key: k, value: v, indent: indent + 2 * (key !== "")})),
    )
    return (key ? div : pre)(
      " ".repeat(indent),
      key ? (
        typeof valueDom !== "object" ? ["🟰 ", b(`${key}: `)] :
          a({onclick: () => hide.val = !hide.val, style: "cursor: pointer"},
            () => hide.val ? "➕ " : "➖ ", b(`${key}: `), () => hide.val ? "…" : "",
          )
      ) : [],
      valueDom,
    )
  }

  const JsonInspector = ({initInput}) => {
    const autoGrow = e => {
      e.style.height = "5px"
      e.style.height = (e.scrollHeight + 5) + "px"
    }
    const textareaDom = textarea({oninput: e => autoGrow(e.target)}, initInput)
    setTimeout(() => autoGrow(textareaDom), 10)
    const errmsg = van.state(""), json = van.state(null)

    const inspect = () => {
      try {
        json.val = JSON.parse(textareaDom.value)
        errmsg.val = ""
      } catch (e) {
        errmsg.val = e.message
      }
    }

    return div(
      div(textareaDom),
      div(button({onclick: inspect}, "Inspect")),
      pre({style: "color: red"}, errmsg),
      () => json.val ? ListItem({key: "", value: json.val}) : "",
    )
  }

  van.add(document.getElementById("demo-json-inspector"), JsonInspector({initInput: `{"name":"John Doe","age":30,"email":"johndoe@example.com","address":{"street":"123 Main St","city":"Anytown","state":"CA","zip":"12345"},"phone_numbers":[{"type":"home","number":"555-1234"},{"type":"work","number":"555-5678"}]}`}))
}

{
  const SuggestionList = ({ candidates, selectedIndex }) => div({ class: "suggestion" }, candidates.map((s, i) => pre({
      "data-index": i,
      class: i === selectedIndex ? "text-row selected" : "text-row",
  }, s)));
  const lastWord = (text) => text.match(/\w+$/)?.[0] ?? "";
  const AutoComplete = ({ words }) => {
      const getCandidates = (prefix) => {
          const maxTotal = 10, result = [];
          for (let word of words) {
              if (word.startsWith(prefix.toLowerCase()))
                  result.push(word);
              if (result.length >= maxTotal)
                  break;
          }
          return result;
      };
      const prefix = van.state("");
      const candidates = van.derive(() => getCandidates(prefix.val));
      // Resetting selectedIndex to 0 whenever candidates change
      const selectedIndex = van.derive(() => (candidates.val, 0));
      const onkeydown = (e) => {
          if (e.key === "ArrowDown") {
              selectedIndex.val = selectedIndex.val + 1 < candidates.val.length ? selectedIndex.val + 1 : 0;
              e.preventDefault();
          }
          else if (e.key === "ArrowUp") {
              selectedIndex.val = selectedIndex.val > 0 ? selectedIndex.val - 1 : candidates.val.length - 1;
              e.preventDefault();
          }
          else if (e.key === "Enter") {
              const candidate = candidates.val[selectedIndex.val] ?? prefix.val;
              const target = e.target;
              target.value += candidate.substring(prefix.val.length);
              target.setSelectionRange(target.value.length, target.value.length);
              prefix.val = lastWord(target.value);
              e.preventDefault();
          }
      };
      const oninput = (e) => prefix.val = lastWord(e.target.value);
      return div({ class: "root" }, textarea({ onkeydown, oninput }), (dom) => {
          if (dom && candidates.val === candidates.oldVal) {
              // If the candidate list doesn't change, we don't need to re-render the
              // suggestion list. Just need to change the selected candidate.
              dom.querySelector(`[data-index="${selectedIndex.oldVal}"]`)
                  ?.classList?.remove("selected");
              dom.querySelector(`[data-index="${selectedIndex.val}"]`)
                  ?.classList?.add("selected");
              return dom;
          }
          return SuggestionList({ candidates: candidates.val, selectedIndex: selectedIndex.val });
      });
  };
  fetch("https://raw.githubusercontent.com/first20hours/google-10000-english/master/20k.txt")
      .then(r => r.text())
      .then(t => t.split("\n"))
      .then(words => {
      van.add(document.getElementById("demo-auto-complete-stateful-binding"), p("Enter English words below with auto completion. Use ↓ and ↑ to change selection, and ↵ to select."), p(a({ href: "https://github.com/first20hours/google-10000-english/blob/master/20k.txt" }, "Dictionary Source")), AutoComplete({ words }));
  });
}

{
  const lastWord = (text) => text.match(/\w+$/)?.[0] ?? "";
  const AutoComplete = ({ words }) => {
      const maxTotalCandidates = 10;
      const getCandidates = (prefix) => {
          const result = [];
          for (let word of words) {
              if (word.startsWith(prefix.toLowerCase()))
                  result.push(word);
              if (result.length >= maxTotalCandidates)
                  break;
          }
          return result;
      };
      const prefix = van.state("");
      const candidates = van.derive(() => getCandidates(prefix.val));
      // Resetting selectedIndex to 0 whenever candidates change
      const selectedIndex = van.derive(() => (candidates.val, 0));
      const SuggestionListItem = ({ index }) => pre({ class: () => index === selectedIndex.val ? "text-row selected" : "text-row" }, () => candidates.val[index] ?? "");
      const suggestionList = div({ class: "suggestion" }, Array.from({ length: 10 }).map((_, index) => SuggestionListItem({ index })));
      const onkeydown = (e) => {
          if (e.key === "ArrowDown") {
              selectedIndex.val = selectedIndex.val + 1 < candidates.val.length ? selectedIndex.val + 1 : 0;
              e.preventDefault();
          }
          else if (e.key === "ArrowUp") {
              selectedIndex.val = selectedIndex.val > 0 ? selectedIndex.val - 1 : candidates.val.length - 1;
              e.preventDefault();
          }
          else if (e.key === "Enter") {
              const candidate = candidates.val[selectedIndex.val] ?? prefix.val;
              const target = e.target;
              target.value += candidate.substring(prefix.val.length);
              target.setSelectionRange(target.value.length, target.value.length);
              prefix.val = lastWord(target.value);
              e.preventDefault();
          }
      };
      const oninput = (e) => prefix.val = lastWord(e.target.value);
      return div({ class: "root" }, textarea({ onkeydown, oninput }), suggestionList);
  };
  fetch("https://raw.githubusercontent.com/first20hours/google-10000-english/master/20k.txt")
      .then(r => r.text())
      .then(t => t.split("\n"))
      .then(words => {
      van.add(document.getElementById("demo-auto-complete-derived-props"), p("Enter English words below with auto completion. Use ↓ and ↑ to change selection, and ↵ to select."), p(a({ href: "https://github.com/first20hours/google-10000-english/blob/master/20k.txt" }, "Dictionary Source")), AutoComplete({ words }));
  });
}
