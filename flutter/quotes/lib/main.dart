import 'package:flutter/material.dart';
import 'quote.dart';
import 'quoteCard.dart';

void main() => runApp(MaterialApp(home: QuoteList()));

class QuoteList extends StatefulWidget {
  @override
  _QuoteListState createState() => _QuoteListState();
}

class _QuoteListState extends State<QuoteList> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.grey[200],
      appBar: AppBar(
        title: Text('Awesome Quotes'),
        centerTitle: true,
        backgroundColor: Colors.redAccent,
      ),
      body: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: Quote.quotes.map((q) {
          return QuoteCard(
            quote: q,
            delete: () {
              setState(() {
                Quote.quotes.remove(q);
              });
            },
          );
        }).toList(),
      ),
    );
  }
}
