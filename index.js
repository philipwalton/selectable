/**
 * @constructor
 */
function Selectable(root) {
  this.root = root;
}


/**
 * Gets the instances root element's text selection start and end index. The
 * indexes are based on the text content, regardless of the HTML structure.
 * @return {{startIndex: number, endIndex: number}}
 */
Selectable.prototype.get = function() {

  var index = 0;
  var startIndex;
  var endIndex;
  var selection = window.getSelection();
  var treeWalker = createTextNodeTreeWalker(this.root);
  var node = treeWalker.firstChild();

  // Make sure the selection is inside of root.
  if (!this.root.contains(selection.anchorNode)) {
    return {startIndex: null, endIndex: null};
  }

  // If there are no text nodes it means the root element is empty so both
  // indexes must be 0.
  if (!node) {
    return {startIndex: 0, endIndex: 0};
  }

  while (node) {
    if (node == selection.anchorNode) {
      startIndex = index + selection.anchorOffset;
    }
    if (node == selection.focusNode) {
      endIndex = index + selection.focusOffset;
      break;
    }
    index += node.length;
    node = treeWalker.nextNode();
  }
  return {
    startIndex: Math.min(startIndex, endIndex),
    endIndex: Math.max(startIndex, endIndex)
  };
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
Selectable.prototype.set = function(startIndex, endIndex) {

  // `endIndex` is optional.
  if (!endIndex) endIndex = startIndex;

  var index = 0;
  var length = this.root.textContent.length;
  var range = document.createRange();
  var selection = window.getSelection();
  var treeWalker = createTextNodeTreeWalker(this.root);
  var node = treeWalker.firstChild();

  // Handle negative or out-of-range start/end indexes.
  if (startIndex < 0) startIndex = length + (startIndex + 1);
  if (endIndex < 0) endIndex = length + (endIndex + 1);
  if (startIndex > length) startIndex = length;
  if (endIndex > length) endIndex = length;

  while (node) {
    if (startIndex >= index && startIndex <= index + node.length) {
      range.setStart(node, startIndex - index);
    }
    if (endIndex >= index && endIndex <= index + node.length) {
      range.setEnd(node, endIndex - index);
      break;
    }
    index += treeWalker.currentNode.length;
    node = treeWalker.nextNode();
  }

  selection.removeAllRanges();
  selection.addRange(range);
};


/**
 * Create an instance of a TreeWalker the only traverses text nodes.
 * @return {TreeWalker} The new instance.
 */
function createTextNodeTreeWalker(element) {
  return document.createTreeWalker(element, NodeFilter.SHOW_TEXT, null, false);
}


module.exports = Selectable;
