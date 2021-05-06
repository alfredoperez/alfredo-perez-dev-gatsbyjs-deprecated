---
title: Prefer using Component Store or services with a behavior subject for local state
description:
tags: ["ngrx","angular"]
type: note
status: evergreen
created: 5/06/21
updated:
---

There are different types of states and not all the state belongs into NgRx store. The following image shows some types of state 

![https://res.cloudinary.com/dagkspppt/image/upload/v1620306278/2021-05-06\_08-02-27\_llz1fj.png](https://res.cloudinary.com/dagkspppt/image/upload/v1620306278/2021-05-06_08-02-27_llz1fj.png)


Global store better suited for managing global shared state, where [Component Store](https://ngrx.io/guide/component-store/comparison#benefits-and-trade-offs) shines managing more local, encapsulated state, as well as component UI state.

Always make sure that the state in the NgRx store really needs to be there!

### External Links
https://www.youtube.com/watch?v=zMtubR7etsE by #AlexOkrushko