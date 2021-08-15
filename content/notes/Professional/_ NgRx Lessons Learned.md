---
title: NgRx Lessons Learned
description:
tags: ["ngrx", "angular"]
type: moc
status: seed
created: 1/30/2021
updated: 8/15/2021
---

## Bedrock

The following can practices are the foundation to how and when to use the NgRx Store.

- [[Use SHARI Principle to define what goes into the store]]
- [[Prefer using Component Store or services with a behavior subject for local state]]
- Prefer using atomic state
- Prefer the use of containers and presentational components

## Actions

- Prefer using Event Storming
- Avoid creating actions based on commands
- Avoid creating actions that modify multiple parts of the state
- Avoid sharing actions
- Prefer the use of a naming convention

## Reducers

- Avoid implicit state duplication
- Avoid entity duplication
- Avoid storing transformed data
- Avoid franken state
- Avoid related nested data
- Prefer dictionaries versus arrays

## Selectors

- Prefer the use selectors to filter and manipulate data from the store
- Avoid to broad selectors by using composed selectors
- Avoid saving selectors values into components properties
- Prefer initializing selectors in the constructor
- Prefer using custom RxJs operators

## Effects

- Avoid dispatching multiple actions from an effect (or component method)
- Avoid monolithic effects
- Prefer the use of stateless effects
