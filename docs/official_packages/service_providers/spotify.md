---
package_name: qilletni/spotify
package_version: 1.0.0-SNAPSHOT
package_author: Adam Yarris
package_github: https://github.com/Qilletni/Qilletni/tree/master/qilletni-spotify
package_docs: https://docs.qilletni.dev/library/spotify
---

# Spotify

The Spotify package is a service provider implementing the full [native feature set](/language/service_providers/#the-native-feature-set) with additional capabilities including playlist management, playing, and Spotify's recommendation API. In this page, the **user** refers to the Spotify account that is logged into Qilletni.

## Features

### Playing Songs

The Spotify `play` keyword is implemented to add the played song to the user's Spotify queue. The queue functionality has two modes: blocking and non-blocking, controlled via the [blocking_queue.ql](https://docs.qilletni.dev/library/spotify/file/blocking_queue.ql) file. 

#### Non-blocking Mode

Non-blocking mode simply puts the song at the end of the queue, and immediately continues with the program. Depending on the program, this could add a lot of songs to the queue at once, but may be beneficial in cases where an immediately exiting program is desired.

This uses significantly less Spotify API calls.

#### Blocking Mode

Blocking mode waits until the song is almost finished, and then adds it to the queue. This is useful for when the queue should have minimal songs in it, or the program is using time-based features, such as checking the time of day while playing music.

As the name implies, blocking mode blocks the program until the next song is almost finished playing (when 75% of the song's duration has passed). Once it is ready, the program continues, and if applicable, the next song is added to the queue.

This uses significantly more Spotify API calls, as polling is required to check when the song is almost finished playing.

To help control the number of API calls made, the Spotify package provides a **fast poll** option, which uses a much faster polling mechanism. When enabled, the Spotify package will poll every 5 seconds, rather than once towards the end of the currently playing song. This adds significantly more API calls, but is the better choice if the user tends to skip, pause, or seek Spotify songs frequently.

### Hooks

Hooks provide a way to inspect what songs are currently being played by the user, provided by [`onSongPlay(fn)`](https://docs.qilletni.dev/library/spotify/file/hooks.ql#fun+onSongPlay%28fn%29). This method accepts a callback function, and polls the Spotify user account every 5 seconds (this is configurable). This callback is passed a `song` parameter, and is the song being played.

The following is an example of using a hook:

```qilletni
import "spotify:hooks.ql"

provider "spotify"

fun songPlayCallback(sng) {
    printf("Playing:\t%s - %s", [sng.getTitle(), sng.getArtist().getName()])
}

onSongPlay(songPlayCallback)

// Halt program forever, running background tasks
processBackground()
```

### Playlist Tools

The Spotify package provides a few tools for working with playlists, provided by [`playlist_tools.ql`](https://docs.qilletni.dev/library/spotify/file/playlist_tools.ql). This includes creating playlists and adding songs to them. Below are some simple examples of adding songs to a new playlist:

```qilletni
import "spotify:playlist_tools.ql"

collection created = createPlaylist("New Playlist")

song[] songs = ["Remember Me" by "Currents"]

addToPlaylist(created, songs)
```

A more common usecase is using [`redirectPlayToList(songList)`](https://docs.qilletni.dev/library/std/#native+fun+redirectPlayToList%28songList%29) to make all `play` calls to instead place the song in a list, then adding those songs to a playlist. 

```qilletni
import "spotify:playlist_tools.ql"

song[] songList = []
redirectPlayToList(songList)

play "Spiral" by "Feyn Entity"
play "Anxiety" by "Breakwaters"

collection myNewPlaylist = createPlaylist("Qilletni generated")

addToPlaylist(myNewPlaylist, songList) // (1)!
```

1. Both songs are added to the new playlist

This also works while playing a collection. The following example plays 5 random songs from a collection, then adds them to a playlist.

```qilletni
import "spotify:playlist_tools.ql"

song[] songList = []
redirectPlayToList(songList)

play "My Playlist" collection by "Bob" order[shuffle] limit[5]

collection myNewPlaylist = createPlaylist("Qilletni generated")

addToPlaylist(myNewPlaylist, songList)
```

### Recommendation API

The full Spotify recommendation API is available for use, provided by the [`Recommender`](https://docs.qilletni.dev/library/spotify/entity/Recommender) entity.

This entity provides a significant amount of options, so only a few will be covered here. This entity is created with these fields set, and [`recommend()`](https://docs.qilletni.dev/library/spotify/entity/Recommender#fun+recommend%28%29) is invoked, returning a `song[]` of recommended songs.

Below is an example of using the Recommendation API using some common options:

```qilletni
import "spotify:recommendations.ql"

Recommender recommender = new Recommender()
        ..seedTracks = ["Cremation Party" by "Ithaca", 
                        "I Am A Fault" by "156/Silence",
                        "Distance" by "Sleep Waker",
                        "Mr. Parker" by "Void of Echoes"]
        ..targetEnergy = 0.8
        ..targetPopularity = 50
        ..targetSpeechiness = 0.8
        ..targetValence = 0.3

song[] recs = recommender.recommend(10) // (1)!

collection collectionOfRecs = collection(recs) // (2)!

play collectionOfRecs // (3)!
```

1. Recommend 10 songs
2. Cast the `song[]` to an in-memory collection
3. Add the songs to your queue
