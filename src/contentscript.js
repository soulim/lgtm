(function () {
  function addStamps() {
    var sidebar = document.getElementById('partial-discussion-sidebar');
    var statuses = sidebar.querySelectorAll('.sidebar-assignee.position-relative .reviewers-status-icon');

    statuses.forEach(function (item) {
      var label = item.getAttribute('aria-label');

      var stamp = document.createElement('div');

      // Label text be one of these:
      //
      //   - approved: "<username> approved these changes"
      //   - changes requested (aka rejected): "<username> requested changes"
      //   - review requested: "Awaiting requested review from <username>"
      //   - commented: "<username> left review comments"
      if (label.includes('approved')) {
        stamp.setAttribute('class', 'lgtm-stamp lgtm-approved');
        stamp.appendChild(document.createTextNode('approved'));
      } else if (label.includes('requested changes')) {
        stamp.setAttribute('class', 'lgtm-stamp lgtm-rejected');
        stamp.appendChild(document.createTextNode('rejected'));
      }

      var header = document.getElementById('partial-discussion-header');
      header.insertBefore(stamp, header.firstChild);
    });
  };

  function init() {
    var allowedPath = /\/[\w\-]+\/[\w\-]+\/pull\/\d+$/;

    if (allowedPath.test(location.pathname)) { addStamps(); };
  }

  // The extension is activated and this script is executed when the page is
  // reloaded. However GitHub uses PJAX to load and replace just part of
  // the page, so there is no actual page reload happening.
  //
  // Because PJAX is using `History.replaceState` and `History.popState` to
  // manipulate URL and update the page parts, this scripts acts as a proxy
  // for `History.replaceState`. It might look a a hack, but it the best
  // solution I have found so far.
  var addHistoryStateProxy = function () {
    var replaceState = history.replaceState;

    history.replaceState = function () {
      window.postMessage('lgtm:pageUpdated', '*');
      return replaceState.apply(this, arguments);
    };
  };

  // The extention is running in a sandbox, so the `History.replaceState` proxy
  // script must be injected on the page.
  var script = document.createElement('script');
  var parent = document.documentElement;
  script.textContent = '('+ addHistoryStateProxy +')();';
  parent.appendChild(script);

  window.addEventListener('message', function (event) {
    if (event.data !== 'lgtm:pageUpdated') { return; }

    init();
  });

  init();
})();
