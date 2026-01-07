# Built-in types

Qilletni comes with following primary types to get started with in its standard library:

- Numbers (`int`, `double`)
- Strings (`string`)
- Booleans (`boolean`)
- Lists (`type[]`)
- Maps (`Map`)
- Optional (`Optional`)
- Any (`any`) // TODO
- Songs (`song`)
- Albums (`album`)
- Playlists (`collection`)
- Artists (`Artist`)
- Weights (`weights`)
- Java Reference (`java`)

## Numbers

Numbers in Qilletni are relatively rudimentary. There are two types, `int` and `double`. `int`s can go from ``-2^31` to `2^31 - 1`, whereas `double`s are floating points, and follow the IEEE 754 standard for 64-bit floating point numbers.

`int`s and `double`s may be converted to one another, via the syntax below.

```qilletni
double d = 3.14

int i = int(d)
print(i)  // Prints "3"

double d2 = double(i)
print(d2)  // Prints "3.0"
```

If math operations go between both `int`s and `double`s, generally they will return as a `double`. Exclusions for this are addition, subtraction, and integer division.

## Strings

Strings are immutable sequences of characters. They may be formatted via

```qilletni
"Number: %d  Float (3 decimal places): %.3f  String: %s".format([123, 3.14159, "hello"])
// Outputs:
//   Number: 123  Float (3 decimal places): 3.142  String: hello
```

The `format` method takes in an array of expressions to format with the string. For simplicity, formatting follows Java's implementation, outlined [here](https://docs.oracle.com/en/java/javase/22/docs/api/java.base/java/util/Formatter.html).

The same can be done with `printf`:

```qilletni
printf("Hello %s!", ["World"])  // Prints "Hello World!"
```

Which is a formatting variation of the `print` command. Strings may also be escaped with a backslash:
```qilletni
print("Hello \"World!\"")  // Prints 'Hello "World!"'
```

## Lists

Lists are ordered collections of either built-in types or entity instances, that may be manipulated. They may ether be created explicitly with a type or have its type assumed implicitly.

```qilletni
string[] strs1 = ["a", "b", "c"]  // Implicit type
string[] strs2 = string["d", "e", "f"]  // Explicit type

any[] strs3 = ["g", "h", "i"]  // Implicitly a string[]
any[] strs4 = string["j", "k", "l"]  // Explicitly a string[]

print(strs1 is string[])
print(strs2 is string[])
print(strs3 is string[])
print(strs4 is string[])

strs1 = [1, 2, 3]  // Errors!
//      ^ Even through the original list was defined with an implcit type, the variable retains its set type forever

any[] ints = [1, 2, 3]  // Implicit type
strs3 = [1, 2, 3]

print(ints is int[])  // true
print(strs3 is int[])  // true
print(strs3 is string[])  // false  strs3 was any any[] but is not an int[]

string[] uhOh = string[1, "b", 3.0]  // Errors!
//              ^ Cannot force all of these types to be strings
```

### Implicit subtypes

Every list has a **subtype**. A list's subtype may either be defined explicitly in the list expression, or implicitly in the expression. As per normal variables, once a **variable** is defined with a type, it may not change. The below example shows a list variable being created with a defined type `string[]` but then assigned to a  list with an implicitly defined type. This list variable is forever a `string[]`.

```qilletni
string[] strs1 = ["a", "b", "c"]  // Implicit type

strs1 = [1, 2, 3]  // Errors!
//      ^ Even through the original list was defined with an implcit type, the variable retains its set type forever
```

If a list is created with an implicit type and not all types are the same in the list, it is assumed an `any[]`, as shown below.

```qilletni
any[] mixed = [1, "b", 3.0]
```

An `any` list may also be created with a consistent type. This means the actual containing list has a type, but the variable could be reassigned to a list with another type. This is done through a type assumption of its contents upon creation.

```qilletni
any[] consistent = [1, 2, 3]
print(consistent is int[])  // true

consistent = ["a", "b", "c"]
print(consistent is string[])  // true

consistent = any[1, 2, 3]
print(consistent is int[])     // false
print(consistent is string[])  // false
```

The end of the above example demonstrates that `any` is also a type, and a list can be created with that as its subtype. This means any value could be added to the list in the future, despite it currently containing only one type. No type assumptions are made in an `any[]` definition.

### Explicit subtypes

Explicit subtypes are fairly straightforward. They are useful when you are passing in parameters to a function, where you want a strict type on the list, or perhaps an empty list where no type assumptions can be made. 

```qilletni
fun handleList(list) {
	if (list is string[]) {
		print("String list")
	} else if (list is int[]) {
		print("Int list")
	} else {
		print("Unknown list")
	}
}

handleList(string["a", "b", "c"])  // Prints "String list"
handleList(int[1, 2, 3])  // Prints "Int list"
handleList(int[])  // Prints "Int list"
handleList([])  // Prints "Unknown list"  - No explicit subtype
```

### Subtype transformations

Sometimes when a list is created, it may have ambiguous types that should actually be all the same. An example of this is if a list of song IDs (strings) are present in a `song[]`. The Qilletni feature of subtype transformations allow the system to attempt to convert the string to the real type.

```qilletni
song[] songs = song["0PmoG29VeyZEEWuSJyfizZ", "https://open.spotify.com/track/58z4qdwM0zpWJEGfjSptR7?si=1d6a32c7f04b4c98", "6BVH6nyMBj601mSaUbbqKc"]
print(songs)
// ^ Prints: [song("Deception" by "Glae"), song("Feel the Pressure" by "DRAIN"), song("Where Light Divides the Holler" by "Knocked Loose")]
```

This feature only works with expressions that would normally be able to be assigned to their type, such as an ID or URL string. This only works with lists of an explicit type, so the following would **NOT** work:

```qilletni
song[] songs = ["0PmoG29VeyZEEWuSJyfizZ", "6BVH6nyMBj601mSaUbbqKc"]  // Errors! This assigns a string[] to a song[]
```

The following table shows the supported type transformations.

| From Type | To Type      | Description of input    |
| --------- | ------------ | ----------------------- |
| `string`  | `song`       | ID or URL of the song   |
| `string`  | `album`      | ID or URL of album      |
| `string`  | `collection` | ID or URL of collection |
| `int`     | `double`     | Any int                 |

## Maps

Maps are a normal Qilletni entity, acting as a wrapper of Java's HashMap. They may be created with `new Map()` or `Map.fromList()` which takes in a list of even size and pairs items together. They may store anything.

```qilletni
Map map = new Map()
map.put("a", 1)
map.put("b", 2)
print(map.get("a"))  // Prints: "1"
```

## Optional

Because Qilletni doesn't support the concept of an empty/null value, Optionals are used to ensure the programmer is always aware of when a value isn't present. They typically should only be used for return values.

The Optional entity defines the following static methods to create an Optional:

```qilletni
Optional a = Optional.fromEmpty()
Optional b = Optional.fromValue("Hello")
```

An Optional can have its empty status checked with `hasValue()` and have its value inspected with `getValue()`. The latter will exit the program and throw an error if no value is found in the optional.

```qilletni
Optional a = Optional.fromEmpty()

printf("Value: %b", [a.hasValue()])  // Prints "false"

any aValue = a.getValue()  // Errors! No value is found
```

## Music Types

Qilletni's whole purpose is dealing with music, so certain functions are baked into the language to assist with that.

All music data is handled by the currently active [Service Provider](/service_providers.md). A service provider assumes there is an ID present for each song, album, collection, and artist. The individual service provider has the ability to parse URLs to extract the relevant ID present. For examples, assume whenever you see an ID, a URL may also be passed in.

If the internal [package config](/package_configs.md) property `eagerLoad` is `true`, the music type will be immediately queried, and will error out if invalid. If the property is not found or `false`, it will be queried whenever the first method that references a property of the type is invoked. See the following example where `eagerLoad` is `false`:

```qilletni
song mySong = "Haunted" by "Burdened Hearts"  // Song is not loaded yet, no API calls have been made

print(mySong.getAlbum())  // The song is queried. Prints 'album("The Best of Times" by "Burdened Hearts")'
```

When using a title and an artist, native music types are defined by the following syntax:

```
<type> <variable name> = <title> <type> by <artist>
```

By default, the `<type>` before `by` defaults to `song`, so it may not be included. So for example, definitions may be

```qilletni
song s1 = "Impulse" by "Harroway"
song s2 = "Heavy Rain" song by "Konami Kode"
album a1 = "Nublar" album by "XO Armor"
collection c1 = "Polish RAVE" collection by "rubbaboy"
```

### Songs

The `song` type in Qilletni represents a song that may be played on a streaming service. A service provider may also count something like a podcast as a song. It is uniquely identified by an ID, identified (sometimes ambiguously) by one or more artists and a title, and has an album. A `song` may be defined by the following:

```qilletni
song s1 = "Fauna" by "Apothica"
song s2 = "2HdTQdGeProvKc35VdNfhD"
song s3 = "https://open.spotify.com/track/2HdTQdGeProvKc35VdNfhD?si=3060f8808cdd4d8c"
```

All the above songs define the same song. For a song to be added to the queue, playlist, etc. the `play` keyword is used. By default, this adds it to the queue, however it may be redirected to perform other actions, dependent on the service provider.

```qilletni
play "Dirty Floor" by "Sypha"  // Adds the song to the queue
```

An example from the spotify library to add songs to a list is:

```qilletni
// Route all played songs to this list
song[] songList = []
redirectPlayToList(songList)

play "Child's Play" by "Hara Kiri"
play "Terror" by "Dread Engine"

print(songList)  // Prints: '[song("Child's Play" by "Hara Kiri"), song("Terror" by "Dread Engine")]'
```

This may be useful if you want to batch add songs to a playlist, perform some kind of analysis on it, etc.

`play` redirects are covered more (// TODO)

### Albums

The `album` type represents an album that songs may be on, with an ID, name, and one or more artists. An album may be defined by:

```qilletni
album a1 = "Here & Now" album by "Framework"
album a2 = "7ulI5y1UiuepuQD61gcKHo"
album a3 = "https://open.spotify.com/album/7ulI5y1UiuepuQD61gcKHo?si=1Ip8PdIdTQKCtlJiXFhyIg"
```

The above album definitions all represent the same albums.

!!! info "Planned Feature"

	Fetching songs from albums is a planned feature. It is already possible natively from within a service provider.

### Playlists

In Qilletni, a playlist is abstracted as a `collection`. A collection is what it sounds like, a collection of songs. A collection may be more than just a playlist though, it may be dynamically created from a list of songs, or may represent some other kind of song list sourced by a service provider (a list of top songs, for instance). A collection contains some basic information regarding it, such as the ID, the creator, song count, songs, and name. A collection may be defined as the following:

```qilletni
collection c1 = "rage death kill" collection by "rubbaboy"
collection c2 = "2fupEjJ1lamW0dfAsXJag6"
collection c3 = "https://open.spotify.com/playlist/2fupEjJ1lamW0dfAsXJag6?si=45dd2429fd0a46ba"
collection c4 = collection(["Empath" by "Fayne", "Full Tilt" by "Johnny Booth", "7L7" by "Above This"])  // Creates an in-memory collection with 3 songs in it
```

The above collections (aside from the last) all define the same playlist. `c4` is defined by a cast-like syntax, taking in a song list within the `collection( )`. The created collection doesn't exist other than in the program's memory, but may act like any other collection.

A collection may also have weights assigned to it, along with an order, in the syntax of:

```qilletni
collection c1 = "Chill Bruh Moment" by "rubbaboy" order[shuffle] weights[myWeights]
```

Where `myWeights` is a variable of type `weights`. `order` may either by "shuffle" or "sequential", defaulting to the former if unspecified. To see more information regarding weights, see [Weights](#weights).

Collections may be played in a similar way playlists are, just with an additional option.

```qilletni
play "96 crayons" by "rubbaboy" limit[10]
```

The above will play 10 shuffled songs from the given playlist. Instead of a number, the limit parameter may also be a time, such as `1h` to play 1 hour of songs (it will stop as soon as 1+ hour has been hit) or `15m` for 15 minutes of songs.

Note this may also be given a variable, as the above is simply an expression.

```qilletni
play myPlaylist limit[30m]  // Plays 30 minutes of songs
```

### Artists

Artists aren't handled as natively as other music types are, as they are an entity. The entity consists of a name and a unique ID. Below are examples of getting an artist:

```qilletni
song mySong = "Orchid Street" by "Arimea"

Artist artist = mySong.getArtist()
printf("Artist id: '%s' name: '%s'", [artist.getId(), artist.getName()])  // Prints "Artist id: '6qNHuzJVAGJ8h2D0qo6wAh' name: 'Arimea'"
```

## Weights

Weights in Qilletni are a unique way of playlist orchestration. They manipulate the way Qilletni chooses which songs to play while playing from a collection. The following is an example of a simple weight definition.

```qilletni
weights demoWeights =
	| 25% "MANGO" by "This Is Falling"
	| 25% "Reflections" by "I Sworn"
```

The above weights, when applied to a collection, make "MANGO" play 25% of the time, for every song picked from the playlist. Likewise, "Reflections" is played 25% of the time, independently to anything else. For percent multipliers, the song doesn't necessarily have to be in the collection it's applied to. If all the percent multipliers add up to 100%, the songs in the collection will be ignored. Note the separator `|`. This disallows for the songs to repeat, allowing for a less repetitive mix. To fine tune this, see [Weight Separators](#weight-separators).

Below is a visualization of a normal random shuffle of 20 songs through a playlist, and the same playlist with weights applied. The playlist consists of 10 songs, including "MANGO" and "Reflections". In the rest of this, the same playlist and visualization techniques will be used, just with different weights to highlight differences.


<div id="legend-container" class="legend"></div>
<div class="playlists-container">
    <div id="playlist-1" class="playlist"></div>
    <div id="playlist-2" class="playlist"></div>
</div>

<script>
    window.addEventListener("load", function() {
        const songColors = {
            "MANGO": "#f44336", // Red
            "Reflections": "#2196f3", // Blue
            // "Monarch": "#9c27b0", // Purple
            // "Song 4": "#ffeb3b", // Yellow
            // "Song 5": "#795548", // Brown
            "Other": "#4caf50", // Green
        };

        const unweighted = ["Other", "Other", "Other", "Reflections", "Other", "MANGO", "Other", "Other", "Other", "Other", "Other", "Other", "MANGO", "Other", "Other", "Other", "Reflections", "Other", "Other", "Other"];
        const weighted = ["Reflections", "Other", "MANGO", "Other", "Reflections", "Other", "Reflections", "Other", "Other", "MANGO", "Other", "Reflections", "MANGO", "Other", "Other", "Other", "MANGO", "Other", "MANGO", "Reflections"];
    
        renderLegend("legend-container", songColors);
    
        renderPlaylist("playlist-1", songColors, unweighted, "Unweighted Shuffle");
        renderPlaylist("playlist-2", songColors, weighted, "Weighted");
    });
</script>

### Nested Weights

Weights can give you some more advanced control over how your songs are chosen from weights. Nested weights allow for the system to choose a song from a child weight every time the parent weight is chosen. Child weights (ones that are nested) must contain only percentages that add up to 100%, as something from it is always chosen. For example, the below code is equivalent to the previous example:

```qilletni 
weights childWeights =
	| 50% "MANGO" by "This Is Falling"
	| 50% "Reflections" by "I Sworn"

weights demoWeights =
	| 50% childWeights
```

This is equivalent because originally, each song had a 25% chance of being chosen. `childWeights` has a 50% chance of being chosen, and each song in `childWeights` has an additional 50% chance. `0.50 * 0.50 = 0.25 = 25%`

### Function Call Weights

Along with nested weights, weights allow for function calls instead of chosen a song from a child weight. This acts the same as adding a child weight, but with a function (optionally with parameters) that is evaluated every time the weight is chosen. The function must always return a song. The following example is also equivalent to the last two.

```qilletni
fun mySongFunction() {
	if (random(0, 10) < 5) {  // 50% of the time
		return "MANGO" by "This Is Falling"
	} else {
		return "Reflections" by "I Sworn"
	}
}

weights demoWeights =
	| 50% mySongFunction()
```

### Collection Weights

Weights may also use a collection to choose what song to play when a weight is selected. The song is selected as it would normally be played from the collection. This includes its own weights, ordering, etc. For example, these are two code examples, one with a collection that's shuffled, and onme that is ordered, and a visualization of their outputs. The playlist `child playlist` contains the songs `"I"`, `"II"`, and `"III"`.

```qilletni
weights demoWeights =
	| 50% "child playlist" collection by "rubbaboy"  // By default shuffled
	
weights demoWeights =
	| 50% "child playlist" collection by "rubbaboy" order[sequential]
```

<div id="legend-container-2" class="legend"></div>
<div class="playlists-container">
    <div id="playlist-1-2" class="playlist"></div>
    <div id="playlist-2-2" class="playlist"></div>
</div>

<script>
    window.addEventListener("load", function() {
        // Colors in the legend
        const displayColors = {
            "child playlist": "#f44336", // Red
            "Other": "#4caf50" // Green
        };

        // Songs to actually light up
        const songColors = {
            "I": "#f44336", // Red
            "II": "#f44336", // Red
            "III": "#f44336", // Red
            "Other": "#4caf50" // Green
        };
    
        const first = ["II", "III", "Other", "I", "Other", "Other", "II", "I", "II", "Other", "I", "III", "Other", "Other", "II", "I", "Other", "III", "II", "Other"];
        const second = ["Other", "Other", "I", "Other", "II", "III", "Other", "I", "Other", "Other", "II", "III", "I", "II", "Other", "III", "Other", "Other", "I", "Other"];
    
        renderLegend("legend-container-2", displayColors);
    
        const names = ["I", "II", "III"];
    
        renderPlaylist("playlist-1-2", songColors, first, "Shuffled", names);
        renderPlaylist("playlist-2-2", songColors, second, "Sequential", names);
    });
</script>

As you can see, when the child playlist is sequential, each time a song is selected from the collection, it is the next song in the collection.

### List Weights

Similar to collection weights, a weight may take in a list of songs as shorthand to defining a collection expression. This is functionally a shorthand of creating a collection that is shuffled. Each time a song is selected from the list, it is randomly chosen and played. Below is an example of a shorthand list weight, and then the equivalent with using a `collection`.

```qilletni
weights demoWeights =
	| 50%  ["I" by "BLACKSHAPE", "II" by "BLACKSHAPE", "III" by "BLACKSHAPE"]

weights demoWeights =
	| 50%  collection(["I" by "BLACKSHAPE", "II" by "BLACKSHAPE", "III" by "BLACKSHAPE"]) order[shuffle]
```


### Weight Separators

Weights also allow for more fine grain control. The separator before each line in the weights `|` may be replaced with one of the following. The below table shows the separator and what it does when the weight is selected. In the context of the table, an individual weight is the line in the `weights` expression. So it may be a song, function call, weight, or a collection.

| Separator Character | Song Repeats                                        | Weight Repeats | Description                                                  |
| ------------------- | --------------------------------------------------- | -------------- | ------------------------------------------------------------ |
| `|`                 | :material-close:{ .table-icon } | :material-check:{ .table-icon }        | This song may **not** be chosen next, but the weight may be |
| `|!`                | :material-check:{ .table-icon } | :material-check:{ .table-icon } | **Both** the song/line and the weight may be chosen next |
| `|~`                | :material-close:{ .table-icon }| :material-close:{ .table-icon } | **Neither** the song nor the weight may be chosen next       |

The column Song Repeats is the song that is chosen from the collection, function, etc. If applied to a single song, the Weight Repeats column may be the same as the Song Repeats column.

Below is another visualization of using the separators, using the following code:

```qilletni
weights childWeights =
    | 50% "MANGO" by "This Is Falling"
    | 50% "Reflections" by "I Sworn"

weights demoWeights =
    | 50% childWeights

weights demoWeights =
    |! 50% childWeights
    
weights demoWeights =
    |~ 50% childWeights
```


<div id="legend-container-3" class="legend"></div>
<div class="playlists-container">
    <div id="playlist-1-3" class="playlist"></div>
    <div id="playlist-2-3" class="playlist"></div>
    <div id="playlist-3-3" class="playlist"></div>
</div>

<script>
    window.addEventListener("load", function() {
        const songColors = {
            "MANGO": "#f44336", // Red
            "Reflections": "#2196f3", // Blue
            "Other": "#4caf50", // Green
        };

        const first = ["Other", "MANGO", "Other", "Other", "Reflections", "Other", "MANGO", "Other", "MANGO", "Reflections", "MANGO", "Other", "Reflections", "Other", "Reflections", "Other", "MANGO", "Other", "MANGO", "Other"];
        const second = ["Reflections", "Other", "Other", "MANGO", "Reflections", "MANGO", "Reflections", "Other", "Reflections", "Reflections", "MANGO", "Reflections", "Reflections", "MANGO", "MANGO", "Other", "Other", "Other", "MANGO", "Other"];
        const third = ["MANGO", "Other", "Other", "MANGO", "Other", "Reflections", "Other", "Other", "MANGO", "Other", "Reflections", "Other", "Other", "MANGO", "Other", "Other", "Reflections", "Other", "Reflections", "Other"];
    
        renderLegend("legend-container-3", songColors);
    
        renderPlaylist("playlist-1-3", songColors, first, "| Separator");
        renderPlaylist("playlist-2-3", songColors, second, "|! Separator");
        renderPlaylist("playlist-3-3", songColors, third, "|~ Separator");
    });
</script>

### Multiplicative  Weights

A less obtrusive way of shuffling a playlist is using multiplicative weights. Instead of having a set probability for every time a song is played, they simply increase the chance a song is played. This takes the following format:

```qilletni
weights demoWeights =
    | 5x "Reflections" by "I Sworn"
```

"Reflections" is played 5x as often as it normally would, assuming it is in the collection (if it's not, it will do nothing). In other words, imagine the collection was taken and "Reflections" was in there once. This will act as if it was in it 5 times. If it was originally in the collection twice, it will show up 10 times.

Let's say the collection has 10 songs in it, one being "Reflections". The following is a shuffle of 20 songs from the playlist, before and after the 5x multiplicative weight.

<div id="legend-container-4" class="legend"></div>
<div class="playlists-container">
    <div id="playlist-1-4" class="playlist"></div>
    <div id="playlist-2-4" class="playlist"></div>
</div>

<script>
    window.addEventListener("load", function() {
        const songColors = {
            "Reflections": "#2196f3", // Blue
            "Other": "#4caf50", // Green
        };

        const unweighted = ["Other", "Other", "Other", "Other", "Other", "Reflections", "Other", "Other", "Other", "Other", "Other", "Other", "Other", "Other", "Other", "Other", "Reflections", "Other", "Other", "Other"];
        const weighted = ["Other", "Reflections", "Reflections", "Other", "Other", "Other", "Other", "Reflections", "Other", "Other", "Other", "Reflections", "Reflections", "Other", "Reflections", "Other", "Other", "Reflections", "Reflections", "Other"];
    
        renderLegend("legend-container-4", songColors);
    
        renderPlaylist("playlist-1-4", songColors, unweighted, "Unweighted Shuffle");
        renderPlaylist("playlist-2-4", songColors, weighted, "Multiplicative Weights");
    });
</script>

## Java References

Java references are useful for interfacing with native methods that may require some special data to be associated with the field (or often times with the containing entity). A java reference may be assigned with either the keyword `empty` to signify a null Java reference internally, or as a return value from a function (usually a native function).

```qilletni
java myRef = empty
java funcRet = someNativeMethod()
```

To see more how a Java reference is used, see the [Native Binding Reference](/native_binding/introduction).
