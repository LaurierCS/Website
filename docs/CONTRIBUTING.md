# Welcome to the LCS Contributing Guide

Thanks for investing your time in contributing to LCS Website!

This document covers an overview of the contribution workflow from opening an issue, branch naming, creating a PR, reviewing and merging the PR.

## New to the Project

To get an overview of the project, read the [README](/README.md) file. 
Here is the list of tools you need to install before starting out:

- [Install Node.js LTS](https://nodejs.org/en/download)
- [Install PNPM](https://pnpm.io/installation)
- [Install Firebase CLI](https://firebaseopensource.com/projects/firebase/firebase-tools/#installation)

## Getting Started

> At the moment, please don't worry about Storybook and Unit Tests

Let's start by explaining the folder structure for this project:

```
LaurierCS/Website
|
|_ .storybook/ -> storybook configuration files
|_ config/ -> firebase configuration files
|_ functions/ -> firebase functions
|_ public/ -> static assets that are not reference in source code
|_ src/
   |_ assets/ -> static assets that are reference or imported in source code
   |_ components/
   |  |_ Button/ -> each component should be in its own folder
   |  |  |_ Button.jsx
   |  |  |_ Button.module.css
   |  |  |_ Button.test.jsx
   |  |_ index.js
   |
   |_ pages/
   |  |_ Landing/ -> each page should be in its own folder
   |
   |_ index.css -> entry css file
   |_ main.jsx -> entry react file
```

### Issues

#### Create a new issue

Before making a new issue, make sure there is no duplicate of the issue. If there is no existing issue for the problem
create one using the [issue form](https://github.com/LaurierCS/Website/issues/new).

**New Issue Checklist**:
- [ ] Issue is not duplicated
- [ ] Descripting Title
- [ ] Description of the problem/feature
- [ ] Steps to replicate problem (if applicable)
- [ ] Assign correct labels

#### Work on an issue

For this project, in general, we don't assign issues to anyone. If you find an issue that you can work on, you can assign yourself to the issue. Make sure to link your development branch to the issue.

### Branching

As a general rule, always branch off from `main`. If you need a specific feature that is being worked on, you can branch off from that but make sure to note down which one has to be merged first in the PR.

#### Name a branch

Here is the convention we have for branch names:

- `feature/issue-number/description`
- `bugfix/issue-number/description`
- `doc/issue-number/description`
- `refactor/issue-number/description`
- `release/version`

A very simple example: `feature/1/register-form`

### Pull Requests

Pull request checklist:

- [ ] Does my PR have an appropriate title?
- [ ] Does my PR have at least two other developers in the team as reviewiers?
- [ ] Is my PR up to date with `main` and there are no merge clonficts?

#### Merge pull requests

When you PR has gotten 2 approvals, you are ready to merge the PR. 
As a general rule, we don't merge PRs in place of the creator of the PR.
Keep an eye of your PRs and merge them when they are approved.

### PR Merged!

Congratulations, you made it! Thanks for reading through the contribution guide.
