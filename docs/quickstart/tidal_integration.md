# Tidal Integration

Tidal integration is provided via the [tidal](https://docs.qilletni.dev/library/tidal/) package, which is a [Service Provider](/language/service_providers). Because it is a standalone package, it must be connected to Tidal.

## API Setup

Because using Qilletni is essentially using an API and not an end application, you must create Tidal API keys for your account.

To create an API, sign into [https://developer.tidal.com/dashboard/](https://developer.tidal.com/dashboard/) and click `Create New App` and fill in the `App name` . Set the `Redirect URIs` field to `http://localhost:9099/tidal` and create the app.

Copy the Client ID and the Client Secret, and run the following `qilletni` command in your console:

```bash
qilletni persist tidal redirectUri=http://localhost:9099/tidal clientId=.. clientSecret=..
```

Filling in your client ID and secret.

## Database Setup

The Tidal package also needs database access for caching music data. If using the default Docker Postgres settings from [Getting Started](/quickstart/getting_started), the following settings are populated by default and do not need manual setting:

```
| Property     | Value                                              |
| ------------ | -------------------------------------------------- |
| dbUsername   | qilletni                                           |
| dbUrl        | jdbc:postgresql://localhost:5435/qilletni_tidal    |
| dbPassword   | pass                                               |
```

To set these manually, the following may be ran:

```bash
qilletni persist tidal dbUsername=.. dbUrl=.. dbPassword=..
```

## Using The Package

The following is a quick example of a Qilletni program. Follow the [Getting Started](/quickstart/getting_started) guide to create a project, and add the following dependency in your `qilletni_info.yml` file:

```yml title="qilletni_info.yml"
dependencies:
  - tidal:^1.0.0
```

And make a basic program, which gets the Tidal ID of a song:

```qilletni title="qilletni_demo.ql"
song sng = "Fireflies" by "Owl City"
print(sng.getId())
```

For more usage of the Tidal package, see the [Tidal Package Page](/packages/tidal).
