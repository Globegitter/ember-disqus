export default function setOnWindow(dependentKey, propertyName) {
  return function() {
    window[propertyName] = this.get(dependentKey);
  }.observes(dependentKey).on('init');
}
