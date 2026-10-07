# Play

The `play` keyword is arguably the most important keyword in Qilletni. It takes in a music type (such as a song or collection) and adds it to a queue on a service provider's account. it may also be redirected to perform various other actions, such as adding a song to a list or use in a function callback.

`play` is used in the following syntax:

```
play <music type> [collection limit] [loop]
```

The music type may be an inline definition of a music type (excluding weights), or a reference to a variable containing a music type.

The limit specifies how many songs should play, if the music type represents more than one song. The `loop` keyword is valid on a music type with a fixed set of songs, for instance a collection or album. If looping, the music type will repeat if it runs out of songs during selection.

The following are examples of `play` being used:

```qilletni
play "Farewell To Fear" by "Erase The Day"    // Plays a single song
play "Nomad" album by "Kublai Khan TX"   // Plays the whole album
play "Nomad" album by "Kublai Khan TX" limit[3]   // Plays 3 random songs from the album
play "Nomad" album by "Kublai Khan TX" order[sequential] limit[3]   // Plays the first 3 songs from the album
play "Nomad" album by "Kublai Khan TX" limit[30m] loop   // Plays songs up to 30 minutes

```

When `play` receives a type that consists of more than one song, it will effectively take the songs that will be played, and invoke `play` on each one individually. This means that the following two code blocks are effectively the same:

```qilletni
collection col = collection(["Vengeance" by "Kahani", "Dead in Orbit" by "Duhkha", "Orpheus" by "Avenoire"]) order[sequential]
play col
```

```qilletni
play "Vengeance" by "Kahani"
play "Dead in Orbit" by "Duhkha"
play "Orpheus" by "Avenoire"
```

## Play settings

As shown in the examples above, `play` accepts a `limit` or a `loop`.

### Limit

A `limit` is defined either by a number of songs, or a duration. When specifying a number of songs, that number of songs is played. When specifying a duration, Qilletni will play songs until it hits that time, and stops. This means that it may play a song through the duration (e.g. if your playlist is filled with exactly 5 minute songs, and you specify `limit[12m]`, it will play songs for 15 minutes).

### Loop

The `loop` setting is used when a `limit` is not specified. If **not** specified, it will play the music type until completion. If it **is** specified, it will repeat the music type once done, and will go on until the program is terminated.

!!! warning

    This is not recommended for use with asynchronous queuing, as it may be difficult to terminate the program manually if it is not blocking.

## Playable Types

The following types may be used with `play`. Any restrictions are listed as well.

- `song`
- `album`
- `collection`
- `weights` (See section on restrictions)

### Playing `weights`

`weights` may be played directly, however all weight entries must add up to 100%, with no other entry type (e.g. no multiplicative weights). This concept is similar to [Nested Weights](/language/types/built_in_types/#nested-weights).

## Redirecting Play

The `play` keyword may be redirected via [`std:music/play_redirect.ql`](https://docs.qilletni.dev/library/std/file/music_play_redirect.ql).

For example, the following redirects the `play`s to a list, and prints it out:

```qilletni
song[] songs = []

redirectPlayToList(songs)

play "In the Way" by "Ithaca"
play "guilt" by "thrown"
play "Severance" by "Allt"

print(songs)

// Outputs:
//  [song("In the Way" by "Ithaca"), song("guilt" by "thrown"), song("Severance" by "Allt")]
```

The `play` keyword may also be redirected to a Qilletni function, as shown below.

```qilletni
fun songPlayCallback(sng) {
    printf("Playing:\t%s - %s", [sng.getTitle(), sng.getArtist().getName()])
}

redirectPlayToFunction(songPlayCallback)

play "In the Way" by "Ithaca"
play "guilt" by "thrown"
play "Severance" by "Allt"

// Outputs:
//  Playing:	In the Way - Ithaca
//  Playing:	guilt - thrown
//  Playing:	Severance - Allt
```