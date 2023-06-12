# NowAPI - When you need an API _Now_

[![CI](https://github.com/robvanderleek/nowapi/actions/workflows/ci.yml/badge.svg)](https://github.com/robvanderleek/nowapi/actions/workflows/ci.yml)
[![npm version](https://badge.fury.io/js/nowapi-cli.svg)](https://badge.fury.io/js/nowapi-cli)

![Logo](https://raw.githubusercontent.com/robvanderleek/nowapi/main/docs/nowapi-logo.png?raw=true)

Instantaneously create static HTTPS REST-like API endpoints.

When you don't want to go through all the hassle of setting up a REST API
backend, NowAPI is the tool for you.

Use cases:
- Tutorials
- Simple static backend API endpoints
- Learning REST APIs
- Debugging client software

> NowAPI has just been released and therefore subject to change.
> Your feedback is very welcome, please [open an issue](https://github.com/robvanderleek/nowapi/issues/new).

# Overview

1. Create a new virtual host:

    ```shell
    nowapi host new
    ```

    Output:

    ```shell
    ✔ Host created: amethyst-ptarmigan-98
    ```

2. Add endpoints:

    For example, the IMDB movie top 3 as a JSON list of IMDB identifiers:

    ```shell
    nowapi endpoint set amethyst-ptarmigan-98 movies/top3 -b '["tt0111161", "tt0068646", "tt0468569"]'
    ```

    Add endpoints for details on each movie:

    ```shell
    nowapi endpoint set amethyst-ptarmigan-98 movie/tt0111161 -b '{"title": "The Shawshank Redemption"}'
    nowapi endpoint set amethyst-ptarmigan-98 movie/tt0068646 -b '{"title": "The Godfather"}'
    nowapi endpoint set amethyst-ptarmigan-98 movie/tt0468569 -b '{"title": "The Dark Night"}'
    ```
    
3. List endpoints
    
   ```shell
   nowapi endpoint ls amethyst-ptarmigan-98
   ```
    
   Output:

   ```shell
   ✔ Loading endpoints
   Endpoints on host amethyst-ptarmigan-98:
   - movies/top3
     https://nowapi.vercel.app/api/hosts/amethyst-ptarmigan-98/movies/top3
   - movie/tt0111161
     https://nowapi.vercel.app/api/hosts/amethyst-ptarmigan-98/movie/tt0111161
   - movie/tt0068646
     https://nowapi.vercel.app/api/hosts/amethyst-ptarmigan-98/movie/tt0068646
   - movie/tt0468569
     https://nowapi.vercel.app/api/hosts/amethyst-ptarmigan-98/movie/tt0468569
   ```

4. Use endpoints

    List movie top-3:
 
    ```shell
    curl https://nowapi.vercel.app/api/hosts/amethyst-ptarmigan-98/movies/top3
    ```
    
    Output:

    ```shell
    ["tt0111161", "tt0068646", "tt0468569"]
    ```

    Get movie by identifier:
 
    ```shell
    curl https://nowapi.vercel.app/api/hosts/amethyst-ptarmigan-98/movie/tt0068646
    ```
   
    Output:
 
    ```shell
    {"title": "The Godfather"}
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

Available commands and options can be listed by running the tool:

```
nowapi
```

It's necessary that you authorize NowAPI to interact with the NowAPI backend. This can be done by logging in as described below.

## Login

```shell
nowapi login
```

Cope the code and open the web page.

## Logout

```shell
nowapi logout
```

## Hosts

### Create a new virtual host

```shell
nowapi host new
```

### Lists your virtual hosts

```shell
nowapi host ls
```

### Delete new virtual host

```shell
nowapi host rm amethyst-ptarmigan-98
```

## Endpoints

### Create a new endpoint

```shell
nowapi endpoint set amethyst-ptarmigan-98 movie/tt0111161 -b '{"title": "The Shawshank Redemption"}'
```

### Lists endpoints on a virtual host:

```shell
nowapi endpoint ls amethyst-ptarmigan-98
```

### Delete endpoint on a virtual host:

```shell
nowapi endpoint rm amethyst-ptarmigan-98 movie/tt0111161
```

# Feedback, suggestions and bug reports

Please create an issue here:
https://github.com/robvanderleek/nowapi/issues

# Contributing

If you have suggestions for how create-issue-branch could be improved, or want
to report a bug, [open an
issue](https://github.com/robvanderleek/nowapi/issues)! All and
any contributions are appreciated.

# License

[ISC](LICENSE) © 2023 Rob van der Leek <robvanderleek@gmail.com>
(https://twitter.com/robvanderleek)
