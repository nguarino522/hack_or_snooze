"use strict";

// So we don't have to keep re-finding things on page, find DOM elements once:

const $body = $("body");

const $storiesLoadingMsg = $("#stories-loading-msg");
const $allStoriesList = $("#all-stories-list");

const $loginForm = $("#login-form");
const $signupForm = $("#signup-form");
const $storiesLists = $(".stories-list");
const $navLogin = $("#nav-login");
const $navUserProfile = $("#nav-user-profile");
const $navLogOut = $("#nav-logout");
const $favoritedStoriesList = $("#user-favorited-stories");
const $navSubmitStory = $("#nav-submit-story");
const $addStoryForm = $("#add-story-form");
const $navMainLinks = $("#navbar-main-links");
const $navMyStories =  $("#nav-mystories");
const $userStoriesLists = $("#user-stories-list");
const $favoritesLink = $("#nav-favorites");
const $userProfile = $("#user-profile");
const $profileEditForm = $("#user-profile-edit");
const $editStoryForm = $("#edit-story-form")

/** To make it easier for individual components to show just themselves, this
 * is a useful function that hides pretty much everything on the page. After
 * calling this, individual components can re-show just what they want.
 */

function hidePageComponents() {
  const components = [
    $addStoryForm,
    $allStoriesList,
    $loginForm,
    $signupForm,
    $userStoriesLists,
    $favoritedStoriesList,
    $profileEditForm,
    $userProfile,
    $editStoryForm
  ];
  components.forEach(c => c.hide());
}

/** Overall function to kick off the app. */

async function start() {
  console.debug("start");

  // "Remember logged-in user" and log in, if credentials in localStorage
  await checkForRememberedUser();
  await getAndShowStoriesOnStart();

  // if we got a logged-in user
  if (currentUser) updateUIOnUserLogin();
}

// Once the DOM is entirely loaded, begin the app

console.warn("HEY STUDENT: This program sends many debug messages to" +
  " the console. If you don't see the message 'start' below this, you're not" +
  " seeing those helpful debug messages. In your browser console, click on" +
  " menu 'Default Levels' and add Verbose");
$(start);


// scroll to bottom of page, will attempt to load more stories
$(window).scroll(function() {
  if($(window).scrollTop() + $(window).height() == $(document).height()) {  
    if (storyList.stories.length >= 25){
      let numberOfStoriesToSkip = storyList.stories.length;
      loadStoriesOnScroll(numberOfStoriesToSkip);
    }
  }
});