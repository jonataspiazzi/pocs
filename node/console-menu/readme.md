A bit of information about the main packages of this project:

There is a few serious problems to use `inquirer`, `nodemon`, and `concurrently` together.

## Problem with `nodemon` + `inquirer`

- Described [here](https://github.com/remy/nodemon/issues/1041).

- Fix: [adding nodemon config](https://github.com/remy/nodemon/blob/master/faq.md#nodemon-doesnt-work-with-my-repl).

