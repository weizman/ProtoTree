<div align="center">
  <h1> <a href="https://weizman.github.io/ProtoTree/?filters=XMLHttpRequest"> ProtoTree 🌳 </a> </h1>
  <p><i> ~ The first tool <b>ever</b> for visually exploring the JavaScript <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Inheritance_and_the_prototype_chain">prototype chain</a> that's generated <b>live</b> in <b>your browser</b> ~ </i></p>
  <br>
  <a href="https://weizman.github.io/ProtoTree/?filters=tree"> <img src="img.jpg" width="400px"> </a>
</div>
<br><br>
<div align="center">
  <h1>  How does ProtoTree work? </h1>
</div>

* ProtoTree uses [LavaTube 🌋](https://github.com/LavaMoat/LavaTube) to recursively walk through the entire JavaScript prototype chain in real time in your browser
* With every recursive visit, ProtoTree slowely builds a tree representation of the prototype chain
* In order to avoid external polution that the app creates, ProtoTree runs the recursive operation inside a cross origin iframe, to leverage a fresh new realm for the job
* Follow the instructions on the app itself to take full adventage of this tool
* Enjoy and please consider to ⭐ this project
