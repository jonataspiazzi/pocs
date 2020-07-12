class Quote {
  String text;
  String author;

  Quote({this.text, this.author});

  static List<Quote> quotes = [
    Quote(
      text: 'Be yourserlf; everyone else is already taken',
      author: 'Oscar Wilde',
    ),
    Quote(
      text: 'I have nothing to declare except my guenius',
      author: 'Oscar Wilde',
    ),
    Quote(
      text: 'The truth is rarelly pure and never simple',
      author: 'Oscar Wilde',
    ),
    Quote(
      text: 'Nothing is lost, nothing is created, everything is transformed',
      author: 'Antoine Lavoisier',
    ),
    Quote(
      text: 'Live as if you were to die tomorrow. Learn as if you were to live forever.',
      author: 'Mahatma Gandhi',
    )
  ];
}
