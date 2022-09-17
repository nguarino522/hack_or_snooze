"use strict";

/******************************************************************************
 * Handling navbar clicks and updating navbar
 */

/** Pull in/refresh list of stories and show the main list of all stories when site name is clicked. */

async function navAllStories(evt) {
  console.debug("navAllStories", evt);
  storyList = await StoryList.getStories();
  hidePageComponents();
  putStoriesOnPage();
}

$body.on("click", "#nav-all", navAllStories);

/** Show login/signup form when "login" clicked */

function navLoginClick(evt) {
  console.debug("navLoginClick", evt);
  hidePageComponents();
  $loginForm.show();
  $signupForm.show();
}

$navLogin.on("click", navLoginClick);

/** When a user first logins in, update the navbar to reflect that. */

function updateNavOnLogin() {
  console.debug("updateNavOnLogin");
  $(".main-nav-links").show();
  $navLogin.hide();
  $navLogOut.show();
  $navUserProfile.text(`${currentUser.username}`).show();
  $navMainLinks.show();
}


/** Handling for when a user clicks submit, show the submit new story form.*/

function navSubmitStoryHandleClick(evt) {
  console.debug("navSubmitStoryHandleClick", evt);
  hidePageComponents();
  $addStoryForm.show();
}

$navSubmitStory.on("click", navSubmitStoryHandleClick);


/** Handling for when a user clicks the my stories link.*/

function navMyStoriesHandleClick (evt) {
  console.debug("navMyStoriesHandleClick", evt);
  hidePageComponents();

  putUserStoriesOnPage();
  $userStoriesLists.show();
}

$navMyStories.on("click", navMyStoriesHandleClick);


// Handling for when a user clicks favorites link.
function navFavoritesClick(evt) {
  console.debug("navFavoritesClick", evt);
  hidePageComponents();
  putFavoritesListOnPage();
}

$favoritesLink.on("click", navFavoritesClick);



// Handling for when a user clicks their profile button.
function navProfileClick(evt) {
  console.debug("navProfileClick", evt);
  hidePageComponents();
  $userProfile.show();
  $("#editprofile").on("click", editProfileClick);
  
}

$navUserProfile.on("click", navProfileClick);


// Function to display edit profile form
function editProfileClick(evt){
  $userProfile.hide();
  $profileEditForm.show();
}

