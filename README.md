## Table of Contents

1. [Project Name and Description](#1---project-name-and-description)

   - [Project Name](#project-name)
   - [Description](#description)
   - [Why Stockphony](#why-Stockphony)
   - [Key Aims](#key-aims)
   - [Inspiration from Twitter](#inspiration-from-twitter)
   - [Beyond Expectations](#beyond-expectations)

2. [Installation Instructions](#2---installation-instructions)

   - [Clone the Repository](#1-clone-the-repository)
   - [Install Dependencies](#2-install-dependencies)
   - [Run the Application](#3-run-the-application)
   - [Access the Application](#4-access-the-application)

3. [Deployment](#3---deployement-instructions)

4. [Usage](#4---usage)

   - [Navigate through Stockphony](#1-navigate-through-Stockphony)
   - [Contribute to Discussions](#2-contribute-to-discussions)
   - [Interact with Posts](#3-interact-with-posts)

5. [Technologies Used](#5---technologies-used)

   - [React](#1-react)
   - [Axios](#2-axios)
   - [CSS](#3-css)
   - [BootStrap](#4-bootstrap)
   - [JavaScript](#5-javascript)

6. [Features](#6---features)

   - [Secure Account Creation and Authentication](#1-secure-account-creation-and-authentication)
   - [Effortless Account Login and Logout](#2-effortless-account-login-and-logout)
   - [Stockphony Creation and Interaction](#3-Stockphony-creation-and-interaction)
   - [Personalized Stockphony Management](#4-personalized-Stockphony-management)
   - [Stockphony Exploration and Interaction](#5-Stockphony-exploration-and-interaction)
   - [Secure Sign-Out Functionality](#6-secure-sign-out-functionality)

7. [Upcoming Features](#7---upcoming-features)

   - [Account Management](#1-account-management)
   - [Contributions Count and Stockphony History](#2-contributions-count-and-Stockphony-history)
   - [User Levels and Rewards](#3-user-levels-and-rewards)
   - [Advantages for Each Level](#4-advantages-for-each-level)
   - [Enhanced User Control](#5-enhanced-user-control)
   - [Upcoming Features: CSS Enhancements](#6-upcoming-features-css-enhancements)

8. [Screenshots or GIFs](#8---screenshots-or-gifs)

9. [Contributing Guidelines](#9---contributing-guidelines)

   - [Fork the Repository](#9-1-fork-the-repository)
   - [Clone the Repository](#9-2-clone-the-repository)
   - [Create a Branch](#9-3-create-a-branch)
   - [Make Changes](#9-4-make-changes)
   - [Commit Changes](#9-5-commit-changes)
   - [Push Changes](#9-6-push-changes)
   - [Submit a Pull Request](#9-7-submit-a-pull-request)
   - [Code Review](#9-8-code-review)
   - [Merge Pull Request](#9-9-merge-pull-request)

10. [License](#10---license)

11. [Acknowledgments](#11---acknowledgments)

## 1 - Project Name and Description

### Project Name

Stockphony

### Description

This is the frontend repo of the project. Please find backend backend repo : "will be aded once it is created"

Stockphony is a dynamic and user-centric web application, focusing on fostering meaningful discussions and interactions. Inspired by the concise nature of Stockphony app.

### Why Stockphony

Will be added soon

### Key Aims

1.  **Community Engagement**

Will be added soon

2. **Knowledge Sharing**

Will be added soon

#### 3 - Inspiration from Stockphony:

Will be added soon

### Beyond Expectations

Will be added soon

Will be added soon

## 2 - Installation Instructions

Will be added soon

1. **Clone the Repository**

git clone <repo>

cd <repo>

2. **Install Dependencies**

npm install

3. **Run the Application**

npm start

4. **Access the Application**

Open your browser and navigate to http://localhost:3000 to view the Stockphony.

That's it! You've successfully installed and launched the Stockphony front-end application. Dive into the world of dynamic discussions and collaborative interactions.

## 3 - Deployment

Before deploying, you first need to make sure the `homepage` key in your
`package.json` is pointing to the correct value. It should be the url of your
deployed application.

To deploy you should first make sure you are on the `master` branch with a
clean working directory, then you can run `npm run deploy` and wait to see if
it runs successfully.

## 4 - Usage

The Stockphony front-end application is designed to offer a seamless and engaging experience for users. Here's how you can make the most of its features:

1. **Navigate through Stockphony**

Will be added soon

1. **React**

Leveraging the power of React, the application achieves a responsive and dynamic user interface. React's component-based architecture facilitates modular development and seamless updates.

2. **Axios**

Axios is used to make the HTTP client request for the below api end points.

3. **CSS**

Cascading Style Sheets (CSS) is utilized to style and design the application, ensuring a visually appealing and cohesive presentation. Custom styling enhances the user experience and aligns with modern design principles.

4. **BootStrap**

Bootstrap is used for responsive designed for buttons and forms and alert user messages.

5. **JavaScript**

JavaScript is employed for adding interactivity and functionality to the application. From handling user interactions to managing asynchronous requests, JavaScript enhances the overall responsiveness of the Stockphony.

## 6 - Features

### `<AuthenticatedRoute />`

This template contains a handy component for creating routes that require a
user to be authenticated before visiting. This component lives in
`src/auth/components/AuthenticatedRoute.js` and is already required in `App`.
It's a thin wrapper around React Router's `<Route />` component. The only
difference is that it expects a prop called `user`, and if that prop is falsy,
it will render a `<Redirect />` that takes the user to `/`. **To use
it, you must pass it the user as a prop!**

It supports both the `component=` and `render=` attributes, but like `<Route />`
it will not forward props to the component if you use `component=`.

### `<AutoAlertDismiss />` Component

This template also already contains a component that displays user messages.
Messages are configurable via redux actions. This component can be found in
`src/components/AutoAlertDismiss/AutoAlertDismiss.js`. **There is no need to add
this component to your app. It is already required in `App`.** A single
component instance is used to manage all alerts application-wide.

The alert can be used by passing the `alertMsg` method to a rendered route. The
`alertMsg` method expects an object with a `heading`, `message`, and a `variant` property.

Use this component in conjunction with the `messages.js` file in the same
directory to create and manage all of your application messages in one place.

The `variant` property must be a Bootstrap alert variant, as this component is merely a
wrapper around the [react-bootstrap Alert
component](https://react-bootstrap.github.io/components/alerts/). The types it
will accept are: 'primary', 'secondary', 'success', 'danger', 'warning', 'info',
'light', and 'dark'.

To change the duration of the message, replace `5000` with a value of your
choice (in milliseconds) in this component's `componentDidMount` method.

### `src/apiConfig.js`

this file will determine whether you're in a production or development
environment and choose an API URL accordingly. Don't forget to replace the
`production` URL with your deployed API's URL.

## Structure

The top-level `App` component stores the currently authenticated
user in state, as well as data related to the flash messages. `App` renders the
`Header` component, and a list of routes, each of which render a component from
`src/components`. The `src/api` directory has a component file, `auth.js`, which
contains all the needed `axios` calls pertaining to authentication.

You can follow this pattern in your app as well. For instance, if you are making
an app that keeps track of books, you might want a `src/api/books.js`, which
contains its own `axios` call pertaining to your books resource CRUD actions.
Using a separate directory within `components` for each individual component you
add makes it easy to locate and update components and has the added benefit of
making it easy to create custom styles that apply to that specific component.
To apply component specific styles, add a file to the component's directory such
as `ComponentName.scss` and then import it directly into the component with
`import './ComponentName.scss'`. This will keep your styles modularized and
make it easier to make changes at the component level.

1. **Secure Account Creation and Authentication**

Users can securely create accounts using a unique username, email, and password. The Stockphony employs robust authentication mechanisms to ensure the privacy and security of user information.

2. **Effortless Account Login and Logout**

Once registered, users can seamlessly log in to their accounts, providing a personalized and secure experience. The logout feature ensures a secure session termination, prioritizing user privacy.

3. **Creation and Interaction**

Will be added soon

4. **Personalized Management**

Will be added soon

5. **Exploration and Interaction**

Will be added soon

6. **Secure Sign-Out Functionality**

Users can securely sign out of their accounts to ensure the protection of their personal information. The sign-out feature guarantees a complete and secure session closure.

These features collectively provide users with a comprehensive and secure experience within the Stockphony. From account creation to active participation in discussions, the platform prioritizes user privacy, engagement, and seamless interaction.

## 7 - Upcoming features

1. **Account Management**

Users will have the capability to manage their accounts, allowing them to modify email addresses and update passwords. This feature enhances user control and customization within the Stockphony.

2. **Contributions Count and Stockphony History**

Will be added soon

3. **User Levels and Rewards**

Introducing a tiered user level system, including levels such as Blue, Gold, Silver, Platinum, and Diamond, based on user contributions. Each level will come with unique advantages, fostering a sense of achievement and recognition within the community.

4. **Advantages for Each Level**

Will be added soon

5. **Enhanced User Control**

Will be added soon

6. **Upcoming Features: CSS Enhancements**

**Custom Styling Options:**

- Explore upcoming features that offer users the ability to apply custom styling to their Stockphony and comments. Tailor the appearance of your contributions to express your unique style within the Stockpony.

**Theme Customization:**

Will be added soon

**Responsive Design Improvements:**

Will be added soon

**User Profile Customization:**

Will be added soon

## 8 - Screenshots or GIFs

**Login account View screenshot**

Will be added soon

## 9 - Contributing Guidelines

Will be added soon

Fork the Repository:

Fork the stockphony repository to your GitHub account.

Clone the Repository:

Clone the forked repository to your local machine using the following command:

git clone https://github.com/nugrezo/stockphony

Create a Branch:

Create a new branch for your contributions:

git checkout -b feature/your-feature-name

Make Changes:

Implement your desired changes, enhancements, or fixes within your branch.

Commit Changes:

Commit your changes with clear and concise commit messages:

git commit -m "Brief description of your changes"

Push Changes:

git push origin feature/your-feature-name

Submit a Pull Request:

Create a pull request from your branch to the main repository's develop branch. Be sure to provide a detailed description of your changes.

Code Review:

Expect feedback and engage in discussions related to your pull request. Make any necessary adjustments based on the feedback received.

Merge Pull Request:

Once your pull request is approved, it will be merged into the main repository.

Thank you for your contributions! Your efforts contribute to the growth and improvement of the Stockphony project.

## 10 - License

The Stockphony project is licensed under the Stockphony_team. This license grants users the freedom to use, modify, and distribute the software within the terms specified in the license document.

## 11 - Acknowledgments

I would like to express my gratitude to individuals and organizations that have contributed directly or indirectly to the development and success of the Stockphony project. Their support and inspiration have played a crucial role in shaping the project into what it is today.

Special thanks to:

will be added soon
