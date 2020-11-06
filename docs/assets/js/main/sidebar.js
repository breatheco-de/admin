function loadSidebar() {
  var sidebarHTML = `<ul class="sidebar__list">
<li>
  <a href="index.html"></a>
  <ul>

    <li>
      <a href="index.html" >Serve & Build</a>
    </li>
    <li>
      <a href="layout.html" >Layout</a>
    </li>
    <li>
      <a href="routing.html" >Routing</a>
    </li>
    <li>
      <a href="navigation.html" >Navigation</a>
    </li>
    <li>
      <a href="breadcrumb.html" >Breadcrumb</a>
    </li>
    <li>
      <a href="authentication.html" >authentication</a>
    </li>
    
    <li>
      <a href="dependencies.html" >dependencies</a>
    </li>
  </ul>
</li>


</ul>
`;
  var $sidebar = $(".doc-content__sidebar").html(sidebarHTML);
  var path = window.location.pathname;
  var page = path.split("/").pop();

  $sidebar.find('.sidebar__list [href="' + path + '"]').addClass("active");
}
