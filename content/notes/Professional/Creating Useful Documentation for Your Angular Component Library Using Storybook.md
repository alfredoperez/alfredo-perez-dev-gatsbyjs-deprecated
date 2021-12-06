---
title: Creating Useful Documentation for Your Angular Component Library Using Storybook
tags: ["storybook","angular"]
type: note
status: evergreen
created: 12/06/2021
updated: 12/06/2021
---

Component libraries in UI development are essential for any large-scale enterprise application to ensure consistency in both presentation and development. Documenting that component library is equally as critical to ensuring teams adopt and use it properly. At SailPoint, we have been building our own component library, internally called Armada, and have been documenting it using [TypeDoc](https://typedoc.org/) along with using Angular Components to demo functionality. While this helped us to show the documentation, it was difficult to maintain because the documentation was embedded in the component classes themselves, and the demos were manually created.

We decided to migrate our documentation to [StoryBook](https://storybook.js.org/) since it is a library that not only helps to document components it also adds tools to streamline the development of components. In this article, we will tell you some of the benefits of StoryBook and how we use it at SailPoint to improve the Developer Experience.

## What are the benefits of using StoryBook?

![https://res.cloudinary.com/dagkspppt/image/upload/v1638820606/notes/Creating%20Useful%20Documentation%20for%20Your%20Angular%20Component%20Library%20Using%20Storybook/StoryBook_x6bxzk.gif](https://res.cloudinary.com/dagkspppt/image/upload/v1638820606/notes/Creating%20Useful%20Documentation%20for%20Your%20Angular%20Component%20Library%20Using%20Storybook/StoryBook_x6bxzk.gif)

For starters, the StoryBook website is now the single source of truth for documentation for all components available in Armada. This is the main website where any team member, from UI Developers to Product Managers, can see the components, specs, and behavior.

For UI Developers, Storybook transformed from a documentation website to a [component workshop](https://bradfrost.com/blog/post/the-workshop-and-the-storefront/) because it provides an easier way to create demos(stories), test inputs, and even outputs. Instead of creating demo components, we could represent different component states by modifying a couple of arguments. Here’s an example:

```ts

/**The main template used for all the icon button stories*/
const Template: Story<IconButtonComponent> = args => {  
   return {  
      props: { ...args }  
   };  
};

export const Primary = Template.bind({});  
Primary.args = { color: 'primary' };

export const Secondary = Template.bind({});  
Secondary.args = { color: 'default' };

export const CustomColors = Template.bind({});
CustomColors.args = { color: 'custom-default' };
```


StoryBook gives the developer a full suite of utilities to test inputs, verify accessibility and see how components behave in different screen sizes.

![https://res.cloudinary.com/dagkspppt/image/upload/v1638820274/notes/Creating%20Useful%20Documentation%20for%20Your%20Angular%20Component%20Library%20Using%20Storybook/StoryBook_Controls_and_accsibility_lnfqy6.gif](https://res.cloudinary.com/dagkspppt/image/upload/v1638820274/notes/Creating%20Useful%20Documentation%20for%20Your%20Angular%20Component%20Library%20Using%20Storybook/StoryBook_Controls_and_accsibility_lnfqy6.gif)

UX Designers and other stakeholders use StoryBook to review component specifications and see it in all its different states, even using complex without setting up the actual website.

![https://res.cloudinary.com/dagkspppt/image/upload/v1638820275/notes/Creating%20Useful%20Documentation%20for%20Your%20Angular%20Component%20Library%20Using%20Storybook/component_states_jeeoit.gif](https://res.cloudinary.com/dagkspppt/image/upload/v1638820275/notes/Creating%20Useful%20Documentation%20for%20Your%20Angular%20Component%20Library%20Using%20Storybook/component_states_jeeoit.gif)

## Structuring Documentation: How We Did It

We decided to use a combination of stories and MDX files in our shared library to provide robust documentation that not only shows component stories but includes detailed descriptions, related links, and specifications. The main goal of stories is to represent the various states available and the primary use of their inputs. To ease this, we created an Angular module to provide standard functionality needed for all our stories, like loading translation files or icons. Also, we developed custom demo wrapper components to standardize the way components are demoed in cases where changing an input was not sufficient.

![https://res.cloudinary.com/dagkspppt/image/upload/v1638820273/notes/Creating%20Useful%20Documentation%20for%20Your%20Angular%20Component%20Library%20Using%20Storybook/Custom_wrapper_demo_components_ikltd0.png](https://res.cloudinary.com/dagkspppt/image/upload/v1638820273/notes/Creating%20Useful%20Documentation%20for%20Your%20Angular%20Component%20Library%20Using%20Storybook/Custom_wrapper_demo_components_ikltd0.png)

The MDX file was added to provide a place where the users can find information about the component, its Interface, an example of usage, links to the source code, and design specs.

![https://res.cloudinary.com/dagkspppt/image/upload/v1638820273/notes/Creating%20Useful%20Documentation%20for%20Your%20Angular%20Component%20Library%20Using%20Storybook/MDX_rnqn5a.png](https://res.cloudinary.com/dagkspppt/image/upload/v1638820273/notes/Creating%20Useful%20Documentation%20for%20Your%20Angular%20Component%20Library%20Using%20Storybook/MDX_rnqn5a.png)

We also developed Web Components to facilitate and standardize the creation of this document. The following code shows an example of how the MDX file is structured:

```html
<Meta title="Components/Buttons/Button/Documentation" />

<mdx-title title="Button" type="component" githubLink="">  
	
</mdx-title><mdx-confluence-link link="">  
	
</mdx-confluence-link><mdx-summary>  
   Buttons express what action will occur when the user clicks or touches it.   
   Buttons are used to initialize an action, either in the background or foreground  of an experience.  
</mdx-summary>

## Example

The following shows the how to create a primary button:

<Story id='components-buttons-button-stories--primary'></Story>

```html  
<slpt-button [color]="'primary'" [label]="'SLPT.SAVE' | slptTranslate"></slpt-button>  `` `


## Interface

The following attributes/methods/events are available on the component.

<ArgsTable of={ButtonComponent}/>
```

## Closing Thoughts

These are some of the benefits we got from switching to StoryBook and it was well-received by developers and other stakeholders alike. We have been creating components and utilities to make it easy to use and also to use for integration tests with [CypressJS](https://www.cypress.io/). This is one of the many ways in which the SailPoint Product organization is continually working to deliver products faster while not only maintaining, but increasing the quality at the same time.