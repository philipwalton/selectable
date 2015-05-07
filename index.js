export default class Selectable {

  constructor(root) {
    this.root = root;
  }

  /**
   * Gets the instances root element's text selection start and end index. The
   * indexes are based on the text content, regardless of the HTML structure.
   * @return {{startIndex: number, endIndex: number}}
   */
  get() {

    let index = 0;
    let startIndex;
    let endIndex;
    let selection = window.getSelection();
    let treeWalker = createTextNodeTreeWalker(this.root);

    while (treeWalker.nextNode()) {
      if (treeWalker.currentNode == selection.anchorNode) {
        startIndex = index + selection.anchorOffset;
      }
      if (treeWalker.currentNode == selection.focusNode) {
        endIndex = index + selection.focusOffset;
        break;
      }
      index += treeWalker.currentNode.length;
    }

    return {
      startIndex: Math.min(startIndex, endIndex),
      endIndex: Math.max(startIndex, endIndex)
    }
  }

  /**
   * Sets the text selection of the instance's root element to the position
   * specified by the start and end index values. The indexes correspond to
   * the text content of the element, regardless of what its actual HTML
   * content is.
   * @param {Number} startIndex The starting point of the selection.
   * @param {Number} endIndex The ending point of the selection. If omitted,
   *     the startIndex is used.
   */
  set(startIndex, endIndex = startIndex) {

    let index = 0;
    let length = this.root.textContent.length;
    let range = document.createRange();
    let selection = window.getSelection();
    let treeWalker = createTextNodeTreeWalker(this.root);

    // Handle negative or out-of-range start/end indexes.
    if (startIndex < 0) startIndex = length + (startIndex + 1);
    if (endIndex < 0) endIndex = length + (endIndex + 1);
    if (startIndex > length) startIndex = length;
    if (endIndex > length) endIndex = length;

    console.log(startIndex, endIndex);

    while (treeWalker.nextNode()) {
      if (startIndex >= index &&
          startIndex <= index + treeWalker.currentNode.length) {
        range.setStart(treeWalker.currentNode, startIndex - index);
      }
      if (endIndex >= index &&
          endIndex <= index + treeWalker.currentNode.length) {
        range.setEnd(treeWalker.currentNode, endIndex - index);
        break;
      }
      index += treeWalker.currentNode.length;
    }

    selection.removeAllRanges();
    selection.addRange(range);
  }
}


/**
 * Create an instance of a TreeWalker the only traverses text nodes.
 * @return {TreeWalker} The new instance.
 */
function createTextNodeTreeWalker(element) {
  return document.createTreeWalker(element, NodeFilter.SHOW_TEXT, null, false);
}
