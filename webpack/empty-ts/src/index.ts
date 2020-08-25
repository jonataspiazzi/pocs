import template from 'lodash/template';

const outputElement = document.getElementById('output');

if (outputElement) {
    var compiled = template(`
    <h1><%- heading %></h1>
    Current date and time: <%- dateTimeString %>
    <p>based on: <a href="https://2ality.com/2020/04/webpack-typescript.html">https://2ality.com/2020/04/webpack-typescript.html</a></p>
  `.trim());
    outputElement.innerHTML = compiled({
        heading: 'ts-demo-webpack',
        dateTimeString: new Date().toISOString(),
    });
}

console.log('hello 3');