from pygments.lexer import RegexLexer
from pygments.token import Comment, String, Number, Operator, Keyword, Name, Text

class QilletniLexer(RegexLexer):
    """
    A Pygments lexer for the Qilletni language.
    """

    name = 'Qilletni'
    aliases = ['qil', 'qilletni']
    filenames = []

    keywords = (
        'import', 'as', 'if', 'else', 'for', 'fun', 'static', 'native', 'on', 'return',
        'empty', 'new', 'order', 'limit', 'loop', 'is', 'infinity', 'play', 'provider', 'by'
    )

    literals = ('true', 'false',)

    types = (
        'any', 'int', 'double', 'string', 'boolean', 'collection',
        'song', 'album', 'java', 'entity', 'weights'
    )

    tokens = {
        'root': [
            # Comments
            (r'//.*?$', Comment.Single),
            (r'/\*\*[\s\S]*?\*/', Comment.Multiline),
            (r'/\*[\s\S]*?\*/', Comment.Multiline),

            # Strings: match a double-quoted string with possible escapes
            (r'"(?:\\.|[^"\\])*"', String),

            # Number (with optional D, x, %, etc.)
            (r'\b-?\d+(\.\d+)?[Dx%]?\b', Number),

            # Operators
            (r'\+\+|\-\-|\+=|\-=|\*=|/~|==|!=|>=|<=|=|\+|\-|/|\.\.|%|!', Operator),

            # Keywords / Types / Literals
            (r'\b(' + '|'.join(keywords) + r')\b', Keyword),
            (r'\b(' + '|'.join(types) + r')\b', Keyword.Type),
            (r'\b(' + '|'.join(literals) + r')\b', Keyword.Constant),

            # Function-like names
            (
                r'\b(?!if|else|for|while|return|native|fun|int|double|collection)'
                r'[a-zA-Z_][a-zA-Z0-9_]*(?=\s*\()',
                Name.Function
            ),

            # Identifiers
            (r'[a-zA-Z_][a-zA-Z0-9_]*', Text),
            (r'\s+', Text.Whitespace),
        ],
    }
