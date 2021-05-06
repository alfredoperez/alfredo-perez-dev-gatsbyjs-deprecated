---
title: Use SHARI Principle to define what goes into the store
description:
tags: ["ngrx"]
type: note
status: evergreen
created: 5/6/21
updated: 5/6/21
---

The NgRx core team has come up with a principle called [**SHARI**](https://ngrx.io/guide/store/why#when-should-i-use-ngrx-store-for-state-management), that can be used as a rule of thumb on data that needs to be added to the store.

‌
-   **Shared**: State that is shared between many components and services
    
-   **Hydrated**: State that needs to be persisted and hydrated across page reloads
    
-   **Available**: State that needs to be available when re-entering routes
    
-   **Retrieved**: State that needs to be retrieved with a side effect, e.g. an HTTP request
    
-   **Impacted**: State that is impacted by other components
    

> Having store in an application doesn't mean that every component should use it. Always evaluate what state should be in the store.
