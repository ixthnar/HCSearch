# The People Search Application
### Project notes for Health Catalyst candidate application
**by** Christopher D. Brown, cdb@ixthnar.com, 512 971-0909

## Setup
### Prerequisits
### Installation

## Requirements Analysis 
### Project Requirements
#### Stated Requirements
* GitHub
* .NET
* Software engineering principles and design patterns
* Minimal amount of setup
* instructions are included in a README
* Use of VS 2017 implied.  _**VS 2019** used with **VS 2017** compatibility verified._
### Business Requirements
#### Stated Requirements
* The application accepts search input in a text box and then displays in a pleasing style a list of people where any part of their first or last name matches what was typed in the search box (displaying at least name, address, age, interests, and a picture). 
* Solution should either seed data or provide a way to enter new users or both
* Simulate search being slow and have the UI gracefully handle the delay
#### Decisions
* Discover and use current best practices for search boxes including rapid and slow response techniques
* Content is name, address, age, interests, and a picture
* Only name is searchable
* Use seed data
* Option to create new users is deferred thus eliminating some security questions
#### Assumptions
* No stated security requirement; therefore, the application will be considered public
* The ability to simulate graceful degradation is covered in technical considerations
### Technical Requirements
#### Stated Requirements
* A Web Application using WebAPI and a front-end JavaScript framework (e.g., Angular, AngularJS, React, Aurelia, etc.) 
* Use an ORM framework to talk to the database
* Unit Tests for appropriate parts of the application 
#### Decisions
* .Net Core 2.2
* React Redux
* Entity Framework Core (SQL Server) 2.2.4 
* SQL Server Express LocalDB 2016
* xUnit for .Net Core 2.2
#### Assumptions
* Mobile first
* UI changes over performance gradients
  * Response times
    * \<= 60 ms: autofill (in place) and suggestions
    * 60 ms to 1000 ms: suggestions
    * \> 1000 ms: Not sure. Caching more important. No autocomplete?
  * Number of characters before autofill/autocomplete starts
    * \<= 60 ms: 1
    * 60 ms to 1000 ms: 2 or more driven by debouncing
    * \> 1000 ms: Not sure. Just wait for submit?
  * Prediction methods
    * Caching
    * Pruning result
    * Most recent first
    * Language based **-- Out of scope**

## Resources
### Articles
* [UX Collective: Best UX practices for search inputs](https://uxdesign.cc/best-ux-practices-for-search-inputs-c44dba565448)
  * Right sized box with magnifying glass as submit button
  * Placeholder text "Search Names"
  * Autocomplete
* [UI Patterns: Autocomplete Design Pattern](http://ui-patterns.com/patterns/Autocomplete)
* [Baymard Institute: 8 Design Patterns for Autocomplete Suggestions](https://baymard.com/blog/autocomplete-design)
* [Measuring sequences of keystrokes with jsPsych](https://link.springer.com/article/10.3758/s13428-016-0776-3)
* [NN/g: Powers of 10: Time Scales in User Experience](https://www.nngroup.com/articles/powers-of-10-time-scales-in-ux/)
* [How to throttle AND debounce an autocomplete input in React](https://www.peterbe.com/plog/how-to-throttle-and-debounce-an-autocomplete-input-in-react)
### Add-Ins
* [Syncfusion: React AutoComplete TextBox Component](https://www.syncfusion.com/react-ui-components/react-autocomplete)

