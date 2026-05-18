export class QuotesModule {
    constructor() {
        this.quotes = [
            { text: "Talk is cheap. Show me the code.", author: "Linus Torvalds" },
            { text: "Programs must be written for people to read, and only coincidentally for machines to execute.", author: "Harold Abelson" },
            { text: "Any fool can write code that a computer can understand. Good programmers write code that humans can understand.", author: "Martin Fowler" },
            { text: "First, solve the problem. Then, write the code.", author: "John Johnson" },
            { text: "Experience is the name everyone gives to their mistakes.", author: "Oscar Wilde" },
            { text: "In order to be irreplaceable one must always be different.", author: "Coco Chanel" },
            { text: "Java is to JavaScript what car is to Carpet.", author: "Chris Heilmann" },
            { text: "Sometimes it pays to stay in bed on Monday, rather than spending the rest of the week debugging Monday's code.", author: "Dan Salomon" },
            { text: "Code is like humor. When you have to explain it, it’s bad.", author: "Cory House" },
            { text: "Fix the cause, not the symptom.", author: "Steve Maguire" },
            { text: "Simplicity is the soul of efficiency.", author: "Austin Freeman" },
            { text: "Before software can be reusable it first has to be usable.", author: "Ralph Johnson" },
            { text: "Make it work, make it right, make it fast.", author: "Kent Beck" },
            { text: "Deleted code is debugged code.", author: "Jeff Sickel" }
        ];

        this.quoteText = document.getElementById('quote-text');
        this.quoteAuthor = document.getElementById('quote-author');
        this.newQuoteBtn = document.getElementById('quote-refresh-btn');

        this.init();
    }

    init() {
        if (!this.quoteText) return;

        // Display a random quote initially
        this.displayNewQuote();

        // Listen for clicks
        this.newQuoteBtn.addEventListener('click', () => {
            // Apply fade-out
            this.quoteText.style.opacity = '0';
            this.quoteAuthor.style.opacity = '0';
            
            setTimeout(() => {
                this.displayNewQuote();
                // Apply fade-in
                this.quoteText.style.opacity = '1';
                this.quoteAuthor.style.opacity = '1';
            }, 300);
        });
    }

    displayNewQuote() {
        const randomIndex = Math.floor(Math.random() * this.quotes.length);
        const quote = this.quotes[randomIndex];
        
        this.quoteText.innerText = `“${quote.text}”`;
        this.quoteAuthor.innerText = `— ${quote.author}`;
    }
}
