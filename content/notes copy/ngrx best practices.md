---
title: NGRX Best Practices
description: 
tags: ["#status/seed🌱", "#ngrx", "#angular"]
created: 1/30/2021
updated: 2/23/21
type: note
---

MOCs:
Related:

# NGRX Best Practices

##  Draft


##  Notes


## Content



# NgRx Best Practices

 ## Bedrock
### Use SHARI Principle to define what goes into the store
 ### Prefer using Component Store or services with a behavior subject for local state
 ### Prefer using atomic state
### Prefer the use of containers and presentational components
   

 ## Actions
### Prefer using Event Storming
### Avoid creating actions based on commands
### Avoid creating actions that modify multiple parts of the state
### Avoid sharing actions
### Prefer the use of a naming convention

 ## Reducers
### Avoid implicit state duplication
### Avoid entity duplication
### Avoid storing transformed data
### Avoid franken state
 ### Avoid related nested data
### Prefer dictionaries versus arrays

## Selectors
### Prefer the use selectors to filter and manipulate data from the store
### Avoid to broad selectors by using composed selectors
### Avoid saving selectors values into components properties
### Prefer initializing selectors in the constructor
### Prefer using custom RxJs operators

## Effects
### Avoid dispatching multiple actions from an effect (or component method)
### Avoid monolithic effects
### Prefer the use of stateless effects



