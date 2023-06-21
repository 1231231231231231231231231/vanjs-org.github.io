interface SuggestionListProps {
  readonly candidates: readonly string[]
  readonly selectedIndex: number
}
const SuggestionList = ({candidates, selectedIndex}: SuggestionListProps) =>
  div({class: "suggestion"}, candidates.map((s, i) => pre({
    "data-index": i,
    class: i === selectedIndex ? "text-row selected" : "text-row",
  }, s)))

const lastWord = (text: string) => text.match(/\w+$/)?.[0] ?? ""

const AutoComplete = ({words}: {readonly words: readonly string[]}) => {
  const getCandidates = (prefix: string) => {
    const maxTotal = 10, result: string[] = []
    for (let word of words) {
      if (word.startsWith(prefix.toLowerCase())) result.push(word)
      if (result.length >= maxTotal) break
    }
    return result
  }

  const prefix = van.state("")
  const candidates = van.state(getCandidates(""))
  van.effect(() => candidates.val = getCandidates(prefix.val))
  const selectedIndex = van.state(0)
  van.effect(() => (candidates.val, selectedIndex.val = 0))

  const suggestionList = (node: Node) => {
    const dom = <HTMLElement>node
    if (dom && candidates.val === candidates.oldVal) {
      // If the candidate list doesn't change, we don't need to re-render the
      // suggetion list. Just need to change the selected candidate.
      dom.querySelector(`[data-index="${selectedIndex.oldVal}"]`)
        ?.classList?.remove("selected")
      dom.querySelector(`[data-index="${selectedIndex.val}"]`)
        ?.classList?.add("selected")
      return dom
    }
    return SuggestionList({candidates: candidates.val, selectedIndex: selectedIndex.val})
  }

  const onkeydown = (e: KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      selectedIndex.val = selectedIndex.val + 1 < candidates.val.length ? selectedIndex.val + 1 : 0
      e.preventDefault()
    } else if (e.key === "ArrowUp") {
      selectedIndex.val = selectedIndex.val > 0 ? selectedIndex.val - 1 : candidates.val.length - 1
      e.preventDefault()
    } else if (e.key === "Enter") {
      const candidate = candidates.val[selectedIndex.val] ?? prefix.val
      const target = <HTMLTextAreaElement>e.target
      target.value += candidate.substring(prefix.val.length)
      target.setSelectionRange(target.value.length, target.value.length)
      prefix.val = lastWord(target.value)
      e.preventDefault()
    }
  }

  const oninput = (e: Event) => prefix.val = lastWord((<HTMLTextAreaElement>e.target).value)

  return div({class: "root"}, textarea({onkeydown, oninput}), suggestionList)
}
