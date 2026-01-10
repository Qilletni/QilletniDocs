# Welcome to Qilletni

Qilletni is a powerful Domain Specific Language for all things music. Seamlessly link streaming services and statistics platforms to curate playlists, find new music, automate playing, and integrate with external tools and APIs with its flexible syntax and library set.

---

## Key Features

- **Platform Integration**: Import packages to gain access to different music platforms, such as **spotify**, **tidal** and **lastfm**
- **Platform-Agnostic Types**: Songs, artists, albums, etc. are automatically converted between music platforms for seamless use
- **Weight-Based Music Selection**: Use [weighted collections](language/types/built_in_types.md#Weights) for advanced playlist orchestration
- **Native Java Bindings**: Leverage Java libraries for enhanced functionality as if they were written in Qilletni
- **Package Support**: Create your own reusable package with our package manager, or leverage existing packages such as [http](https://docs.qilletni.dev/library/http/), [json](https://docs.qilletni.dev/library/json/), [postgres](https://docs.qilletni.dev/library/postgres/), or [metadata](https://docs.qilletni.dev/library/metadata/)

[Get Started →](quickstart/getting_started)

---

## Get Started

Jump right into Qilletni with our [Getting Started Guide](quickstart/getting_started.md), where you’ll learn how to:

- Install Qilletni.
- Write your first program.
- Run `.ql` scripts to create and manage playlists.

```qilletni
// Weight the songs in your playlist
weights myWeights =
    | 20% "Song A" by "Artist A"  // 20% of the time, play "Song A"
    | 10% "Song B" by "Artist B"
    | 5x  "Song C" by "Artist C"  // Play "Song C" 5 times more often

// Get your playlist & assign weights to it
collection myCollection = "My Playlist" collection by "username" weights[myWeights]

// Play 10 songs from your playlist
play myCollection limit[10]
```

[Start Now →](quickstart/getting_started)

---

## Reference Documentation

Dive deep into the Qilletni language and its libraries:

- **[Language Reference](language/introduction.md)**: Syntax, entities, functions, and control flow.
- **[Library Reference](https://docs.qilletni.dev/)**: Qilletni documentation for all official packages
- **[Java API Reference](https://api.qilletni.dev/)**: Documentation for all API methods provided by Qilletni to make your own service providers packages with native bindings

---

## Why Qilletni?

Working with any music service API is largely boilerplate, moving your focus away from what you're making to how to make it. Qilletni provides a familiar C-style syntax with its own music-specific features to speed up the process of creation.

It's never been this easy to programmatically transfer songs or playlist from one music service to another, or manipulate how playlists are played.

---

## Example Program

Here’s a sneak peek of what Qilletni can do:

The following program takes a Spotify playlist, plays 2 songs from it, and then 3 recommended songs with high energy and low popularity. All songs are added to a new playlist on your account.

```qilletni
import "spotify:recommendations.ql"
import "spotify:play_redirect.ql"
import "spotify:playlist_tools.ql"
import "std:util/stack.ql"

// Songs to play more frequently
weights powerRotation =
    | 85% ["Wants I Need" by "156/Silence",
            "Anti-Saviour" by "Voluntary Victim",
            "Millstone" by "ROSARY"]
    | 15% ["Heavy Rain" by "Konami Kode",
            "Decay" by "Elwood Stray",
            "All or Nothing" by "Foundations"]

// 30% of the time, choose from powerRotation
weights myWeights =
   |~ 30% powerRotation

// A spotify playlist to play songs from, with weights
collection mySongs = "My Playlist #59" collection by "rubbaboy" weights[myWeights]

// Redirect the "play" keyword to add played songs to a list, instead of playing them
song[] songList = []
redirectPlayToList(songList)

// Recommend Spotify songs
Recommender recommender = new Recommender()
        ..seedTracks = ["Truth Serum" by "Gutter King", 
                        "Wayside" by "AEONS"]
        ..targetEnergy = 1.0     // High energy
        ..targetPopularity = 10  // Low popularity

// Recommend 30 songs, add them to a stack
song[] recs = recommender.recommend(30)
Stack recommendations = Stack.fromList(recs)

// Play 2 shuffled songs from mySongs playlist, then 3 recommendations
for (recommendations.size() >= 3) {
    play mySongs limit[2]

    for (i..3) {
        play recommendations.pop()
    }
}

// Create a new playlist in Spotify
Date date = Date.now()
collection myNewPlaylist = createPlaylist("Qilletni generated on %d/%d".format([date.getMonth(), date.getDay()]))

// Add the songs to the new playlist
addToPlaylist(myNewPlaylist, songList)
printf("Created a playlist with %s songs", [songList.size()])
```

Explore more examples in our [Examples Section →](examples.md)
