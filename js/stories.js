"use strict";

// This is the global list of the stories, an instance of StoryList
let storyList;

/** Get and show stories when site first loads. */

async function getAndShowStoriesOnStart() {
  storyList = await StoryList.getStories();
  $storiesLoadingMsg.remove();

  putStoriesOnPage();
}


// Update and show new storie when scroll on page down on main stories section
async function loadStoriesOnScroll(skipNum) {
  console.debug("loadStoriesOnScroll")
  await StoryList.loadMoreStories(skipNum);
  putStoriesOnPage();

  $storiesLoadingMsg.remove();
}

/**
 * A render method to render HTML for an individual Story instance
 * - story: an instance of Story
 *
 * Returns the markup for the story.
 */

function generateStoryMarkup(story, showDeleteBtn = false, showEditBtn = false) {
  // console.debug("generateStoryMarkup", story);

  const hostName = story.getHostName();

  // used to determine whether a use is logged in which means to display favorite star in story lists
  const showFavoriteStar = Boolean(currentUser);

  return $(`
      <li id="${story.storyId}">
      ${showDeleteBtn ? makeDeleteBtn() : ""}
      ${showFavoriteStar ? makeFavoriteStar(story, currentUser) : ""}
      ${showEditBtn ? makeEditBtn() : ""}
        <a href="${story.url}" target="a_blank" class="story-link">
          ${story.title}
        </a>
        <small class="story-hostname">(${hostName})</small>
        <small class="story-author">by ${story.author}</small>
        <small class="story-user">posted by ${story.username}</small>
      </li>
    `);
}

// make delete button HTML to add to user story list
function makeDeleteBtn() {
  return `<i class="trashcan fas fa-trash-alt"></i>`;
}

// make edit button HTML to add to user story list
function makeEditBtn() {
  return `<i class="editbtn fas fa-edit"></i>`;
}


// make favorite star HTML to add to user story list
function makeFavoriteStar(story, user) {
  const isFavorite = user.isFavorite(story);
  const starType = isFavorite ? "fas" : "far";
  return `<i class="star ${starType} fa-star"></i>`;
}


/** Gets list of stories from server, generates their HTML, and puts on page. */

function putStoriesOnPage() {
  console.debug("putStoriesOnPage");

  $allStoriesList.empty();

  // loop through all of our stories and generate HTML for them
  for (let story of storyList.stories) {
    const $story = generateStoryMarkup(story);
    $allStoriesList.append($story);
  }

  $allStoriesList.show();
}


/** function to handle when the add new story form is submitted
 will grab all necessary information from form*/
async function handleSubmitNewStory(evt) {
  console.debug("handleSubmitNewStory");
  evt.preventDefault();

  // grab and set information for story
  const title = $('#title').val();
  const author = $('#author').val();
  const url = $('#url').val();
  const username = currentUser.username;
  const storyData = { title, url, author, username };

  let story = await storyList.addStory(currentUser, storyData);
  let submitStory = generateStoryMarkup(story);
  $allStoriesList.prepend(submitStory);

  // hide and reset form
  $addStoryForm.hide();
  $addStoryForm.trigger("reset");

  // call function to place the story on page
  putStoriesOnPage()
}

$addStoryForm.on("submit", handleSubmitNewStory);


// Gets list of current user stories from server, generates HTML, and put on page.

function putUserStoriesOnPage() {
  console.debug("putUserStoriesOnPage");
  $userStoriesLists.empty();

  if (currentUser.ownStories.length === 0) {
    $userStoriesLists.append("<p>User has not added any stories yet!</p>");
  } else {
    for (let i = 0; i < currentUser.ownStories.length; i++) {
      let story = generateStoryMarkup(currentUser.ownStories[i], true, true);
      $userStoriesLists.append(story);
    }
  }
  $userStoriesLists.show();
}


// Gets list of current favorited user stories from server, generates HTML, puts on page.
function putFavoritesListOnPage() {
  console.debug("putFavoritesListOnPage");
  $favoritedStoriesList.empty();

  if (currentUser.favorites.length === 0) {
    $favoritedStoriesList.append("<p>No favorites added!</p>");
  } else {
    for (let i = 0; i < currentUser.favorites.length; i++) {
      let story = generateStoryMarkup(currentUser.favorites[i]);
      $favoritedStoriesList.append(story);
    }
  }
  $favoritedStoriesList.show();
}

// Handles favoriting or un-favoriting a story for a user
async function handleStoryFavoriting(evt) {
  console.debug("handleStoryFavoriting");
  const tgt = evt.target;
  const closestLi = tgt.closest("li");
  const storyId = closestLi.id;
  let story = storyList.stories.find(s => s.storyId === storyId);
  if (!story){
    let res = await axios.get(`https://hack-or-snooze-v3.herokuapp.com/stories/${storyId}`);
    story = res.data.story;
    storyList.stories.push(story);
  }

  if (tgt.classList.contains("fas")) {
    await currentUser.removeFavorite(story);
    tgt.classList.remove("fas");
    tgt.classList.add("far");
  } else {
    await currentUser.addFavorite(story);
    tgt.classList.remove("far");
    tgt.classList.add("fas");
  }

}

$storiesLists.on("click", ".star", handleStoryFavoriting);



// Handles removing or deleting a current user's created story
async function removeDeleteStory(evt) {
  console.debug("removeDeleteStory");
  const tgt = evt.target;
  const closestLi = tgt.closest("li");
  const storyId = closestLi.id;
  await storyList.removeStory(currentUser, storyId);
  await putUserStoriesOnPage();
}

$userStoriesLists.on("click", ".trashcan", removeDeleteStory);



// Bring you to edit story form
function loadEditStoryForm(evt) {
  hidePageComponents();
  let storyId = evt.target.parentElement.id;
  generateStoryInfoToEdit(storyId);
  $editStoryForm.show();
}

$storiesLists.on("click", ".editbtn", loadEditStoryForm);


// grab and inputs the correct information to add to the edit story form
function generateStoryInfoToEdit(storyId) {
  console.debug("generateStoryInfoToEdit");
  const story = storyList.stories.find(s => s.storyId === storyId);
  $("#story-id").text(story.storyId);
  $("#story-title").text(story.title);
  $("#story-author").text(story.author);
  $("#story-url").text(story.url);
}


// Handler for when the edit story form is submitted
async function handleSubmitEditStory(evt) {
  console.debug("handleSubmitNewStory");
  evt.preventDefault();

  const storyId = $("#story-id").text();
  let title = $('#title-edit').val();
  let author = $('#author-edit').val();
  let url = $('#url-edit').val();

  // setting any field that wasn't set above to current value to allow for 1 or any 2 combination of fields to be submitted
  if (!title) { title = $("#story-title").text(); }
  if (!author) { author = $("#story-author").text(); }
  if (!url) { url = $("#story-url").text(); }

  const storyData = { title, url, author };

  try {
    await storyList.editStory(currentUser, storyData, storyId);
    alert("Selected story has been successfully updated!");
    await checkForRememberedUser();
    $editStoryForm.trigger('reset');
    $("#nav-all").trigger('click');
  } catch (error) {
    handleErrors(error);
  }
}

$editStoryForm.on("submit", handleSubmitEditStory);

