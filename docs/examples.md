# Code Examples

## Adding Metadata Tags

The following uses the [metadata](https://docs.qilletni.dev/library/metadata/) library. This attaches data to songs, albums and artists to help filter or organize music. This uses an internal database, so metadata persists.

```qilletni
import "metadata:metadata.ql"

Metadata metadata = Metadata.createMetadata(Database.createDatabase("localhost", 5444, "metadata", "admin", "pass"))

song mySong = "God Knows" by "Knocked Loose"

metadata.addTag(mySong, "goated")
metadata.addTag(mySong, "cool")

printf("Tags for song: %s", [metadata.getTags(mySong).join(", ")])  // Prints "Tags for song: goated, cool"

```

## Last.fm to Spotify Conversion

As Qilletni supports automatic and efficient conversion between music providers, collections from one to another is seamless. The following takes a list of Last.fm songs and adds them to a newly created Spotify playlist.

```qilletni
import "lastfm:lastfm.ql"
import "spotify:playlist_tools.ql"

provider "lastfm" // (1)!

Page page = new Page()
                ..page = 1
                ..count = 100

LastFmResult result = getTopTracks("RubbaBoy", "3month", page) // (2)!

if (result.isError()) { // (3)!
    printf("Error: %s", [result.errorMessage])
    exit(1)
}

for (track : result.wrappedData.getValue()) {
    printf("%s\t plays  %s", [track.playCount, track.track])
}

provider "spotify" // (5)!

collection newPlaylist = createPlaylist("Top Song Playlist") // (4)!
addToPlaylist(newPlaylist, result.data)

print("Created a playlist with %s songs".format([result.data.size()]))
```

1. Ensures the music provider is Last.fm
2. Makes an API request to Last.fm to get the top 100 songs played in the last 3 months
3. Methods that are API calls are handled a little more manually, so they should gracefully terminate if unsuccessful
4. Create a new Spotify playlist and add the songs
5. Switch the music provider to Spotify so conversion happens when needed

## Spotify Recommendation API

The Spotify library's [Recommender](https://docs.qilletni.dev/library/spotify/entity/Recommender) entity, the full Spotify recommendation system can be utilized to fine tune music selections.

```qilletni
import "spotify:recommendations.ql"
import "spotify:play_redirect.ql"
import "spotify:playlist_tools.ql"
import "std:util/stack.ql"

weights powerRotation =
    | 85% ["Wants I Need" by "156/Silence", "Monarch" by "Glasswaves",
            "Anti-Saviour" by "Voluntary Victim",
            "Millstone" by "ROSARY",
            "Hell (I let the Devil In)" by "Breakwaters",
            "Distance" by "Sleep Waker",
            "Claustrophobic" by "Before I Turn"]
    | 15% ["Heavy Rain" by "Konami Kode",
            "Decay" by "Elwood Stray",
            "All or Nothing" by "Foundations"]

weights metalWeights =
   |~ 30% powerRotation

collection metalSongs = "My Playlist #59" collection by "rubbaboy" weights[metalWeights]

song[] songList = []
redirectPlayToList(songList)

// All recommended songs
Stack recommendations = new Stack()

fun generateUniqueRecommendations() {
    Recommender recommender = new Recommender()
            ..seedTracks = ["Truth Serum" by "Gutter King", 
                            "Paradise" by "Dark Island",
                            "Anti-Saviour" by "Voluntary Victim",
                            "Spiral" by "Feyn Entity",
                            "Dark Tunnel" by "Beholder"]
            ..targetEnergy = 1.0
            ..targetPopularity = 10

    song[] recs = recommender.recommend(100)

    for (rec : recs) {
        if (!metalSongs.containsArtist(rec.getArtist())) {
            recommendations.push(rec)
        }
    }
    
    print("Generated %d unique recommendations".format([recommendations.size()]))
}

generateUniqueRecommendations()

// Play 2 shuffled songs from metal playlist, then 3 recommendations
for (recommendations.size() >= 3) {
    play metalSongs limit[2]

    for (i..3) {
        play recommendations.pop()
    }
}

// Add all played songs to a new playlist
Date date = Date.now()
collection myPlaylist = createPlaylist("Recs only %d/%d".format([date.getMonth(), date.getDay()]))

addToPlaylist(myPlaylist, songList)
print("Created a playlist with %s songs".format([songList.size()]))
```

## Listening For Song Playing

Qilletni can also use hooks to monitor things like what song is currently being played. This ability also allows for server-side processing. The below example logs when the user changes what song they are playing on their account. For how this is implemented, see the [Background Tasks](/native_binding/background_tasks) page.

```qilletni
import "spotify:hooks.ql"

fun songPlayCallback(sng) { // (1)!
    printf("Playing:\t%s - %s", [sng.getTitle(), sng.getArtist().getName()])
}

onSongPlay(songPlayCallback)

// Halt program forever, running background tasks
processBackground()
```

1. This method is invoked every time a song is changed
