# PalmTree

## Status: Beta
A lightweight service starter, and monitor to ensure programs keep running

## Usage
Palm tree is super easy to use. It was designed for NodeOS so it needs to be
embeded in the startup process. On a NodeOS system, you can swap out your "Hi,
I'm a user init script" default `/init` with a symlink pointing to `PalmTree`'s
executable. On any other OS, you can have your os's program starter execute
PalmTree.
