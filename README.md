# NowAPI - When you need an API Now

![Logo](https://raw.githubusercontent.com/robvanderleek/nowapi/main/docs/nowapi-logo.png?raw=true)

# Overview

1. Create a new virtual host:

```shell
$ nowapi host new
✔ Host created: amethyst-ptarmigan-98
```

2. Add endpoints:

```shell
nowapi endpoint set amethyst-ptarmigan-98 movies/top3 -b '["tt0111161", "tt0068646", "tt0468569"]'
✔ Endpoint updated: movies/top3
```

```shell
nowapi endpoint set amethyst-ptarmigan-98 movie/tt0111161 -b '{"title": "The Shawshank Redemption"}'
✔ Endpoint updated: movie/tt0111161
```

```shell
nowapi endpoint set amethyst-ptarmigan-98 movie/tt0068646 -b '{"title": "The Godfather"}'
✔ Endpoint updated: movie/tt0111161
```

```shell
nowapi endpoint set amethyst-ptarmigan-98 movie/tt0468569 -b '{"title": "The Dark Night"}'
✔ Endpoint updated: movie/tt0111161
```

# Installation

## Homebrew

For macOS there is a Homebrew tap available: 

```shell
brew tap robvanderleek/nowapi
brew install nowapi
```

## NPX

Using `npx`, installation is not necessary. You can run NowAPI on a system with
NodeJS 18 or higher from the command-line as follows:

```shell
npx nowapi-cli@latest -V
```

this should display the version number of the latest release.

Using `npm` NowAPI can be installed globally as follows:

```shell
npm install -g nowapi-cli
```

## Platform binaries

Binaries for different platforms (Linux, Windows) are available on the [latest
release page](https://github.com/robvanderleek/nowapi/releases/latest).

# Usage

# Configuration

# Development

# Feedback, suggestions and bug reports

# Contributing

# License
