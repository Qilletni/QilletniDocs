# Last.fm Integration

Last.fm integration is provided via the [lastfm](https://docs.qilletni.dev/library/lastfm/) package, which is a [Service Provider](/language/service_providers). Because it is a standalone package, it must be connected to Last.fm.

## API Setup

Because using Qilletni is essentially using an API and not an end application, you must create Last.fm API keys for your account.

To create an API, sign into [https://www.last.fm/api/account/create](https://www.last.fm/api/account/create) and fill out the information, and click **Submit**. The Callback URL is not required.

From there, copy the API Key and Shared Secret, and run the following `qilletni` command in your console:

```bash
qilletni persist lastfm apiKey=api-key apiSecret=api-secret
```

Where `api-key` is your API Key, such as `f8ea7243239ec13d1ab6b858532c5b32`, and `api-secret` is your Shared Secret, such as `7f713e749d63adeab805ed78c9585f11`.

## Database Setup

The Last.fm package also needs database access for caching music data. If using the default Docker Postgres settings from [Getting Started](getting_started.md), the following settings are populated by default and do not need manual setting:

```
| Property     | Value                                             |
| ------------ | ------------------------------------------------- |
| dbUsername   | qilletni                                          |
| dbUrl        | jdbc:postgresql://localhost:5435/qilletni_lastfm  |
| dbPassword   | pass                                              |
```

To set these manually, the following may be ran:

```bash
qilletni persist lastfm dbUsername=.. dbUrl=.. dbPassword=..
```

## Using The Package

The following is a quick example of a Qilletni program. Follow the [Getting Started](/quickstart/getting_started) guide to create a project, and add the following dependency in your `qilletni_info.yml` file:

```yml title="qilletni_info.yml"
dependencies:
  - lastfm:^1.0.0
```

And make a basic program, which checks the most recent 50 songs played on your account:

```qilletni title="qilletni_demo.ql"
import "lastfm:lastfm.ql"

LastFmResult result = getRecentTracks("RubbaBoy")

if (result.isError()) {
    printf("Error: %s", [result.errorMessage])
    exit(1)
}

printf("Recent Tracks:\n\t%s", [result.data])
```

Which should output something similar to:

```txt
Recent Tracks:
        [song("Euclid" by "Sleep Token"), song("Take Me Back to Eden" by "Sleep Token"), ...]
```

For more usage of the Last.fm package, see the [Last.fm Package Page](/packages/lastfm).

