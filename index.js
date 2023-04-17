import data from './data.json' assert { type: 'json' };
const main = document.querySelector('main');
const overlay = document.getElementById('overlay');
const { currentUser, comments } = data;
let commentId = null;
let replyId = null;
let lastId = 4;

const deleteModal = document.createElement('div');
deleteModal.className = 'delete-modal';
const modalTitle = document.createElement('h2');
modalTitle.textContent = 'Delete comment';
modalTitle.className = 'modal-title';
const modalDescription = document.createElement('p');
modalDescription.textContent =
	'Are you sure you want to delete this comment? This will remove the comment and it cannot be undone';
modalDescription.className = 'modal-description';
const cancelConfirmContainer = document.createElement('div');
cancelConfirmContainer.className = 'cancel-confirm-container';

const cancel = document.createElement('button');
cancel.textContent = 'no. cancel';
cancel.className = 'cancel-confirm-btn';
cancel.id = 'cancel';
cancel.addEventListener('click', () => {
	deleteModal.style.display = 'none';
	overlay.style.display = 'none';
	updatePage();
});

const confirm = document.createElement('button');
confirm.textContent = 'yes. delete';
confirm.id = 'confirm';
confirm.className = 'cancel-confirm-btn';
confirm.addEventListener('click', () => {
	const comment = comments.find((item) => item.id === commentId);
	const newReplies = comment.replies.filter((item) => item.id !== replyId);
	comment.replies = newReplies;
	deleteModal.style.display = 'none';
	overlay.style.display = 'none';
	updatePage();
});

cancelConfirmContainer.appendChild(cancel);
cancelConfirmContainer.appendChild(confirm);
deleteModal.appendChild(modalTitle);
deleteModal.appendChild(modalDescription);
deleteModal.appendChild(cancelConfirmContainer);

overlay.addEventListener('click', function () {
	deleteModal.style.display = 'none';
	overlay.style.display = 'none';
});

const setDeleteModalTopAttribute = () => {
	const scrollY = window.scrollY;
	const windowHeight = window.innerHeight;
	const elementHeight = deleteModal.offsetHeight;
	const offset = (windowHeight - elementHeight) / 2;
	deleteModal.style.top = offset + scrollY + 'px';
};

window.addEventListener('scroll', function () {
	setDeleteModalTopAttribute();
});

const getReply = (parentCommentId, replyId) => {
	const parentComment = comments.find(
		(comment) => comment.id === parentCommentId
	);
	const reply = parentComment.replies.find((reply) => reply.id === replyId);
	return reply;
};

const getComment = (commentId) => {
	const comment = comments.find((comment) => comment.id === commentId);
	return comment;
};

const increaseScore = (id, parentCommentId) => {
	if (parentCommentId) {
		const reply = getReply(parentCommentId, id);
		reply.score += 1;
	} else {
		const comment = getComment(id);
		comment.score += 1;
	}
	updatePage();
};

const decreaseScore = (id, parentCommentId) => {
	if (parentCommentId) {
		const reply = getReply(parentCommentId, id);
		if (reply.score > 0) reply.score -= 1;
	} else {
		const comment = getComment(id);
		if (comment.score > 0) comment.score -= 1;
	}
	updatePage();
};

const updatePage = () => {
	while (main.firstChild) {
		main.removeChild(main.firstChild);
	}
	console.log(comments);
	console.log('update');
	displayComments(comments);
	currentUserAction('send');
	setDeleteModalTopAttribute();
	main.appendChild(deleteModal);
};

const createComment = (
	commentData,
	index = 0,
	arr = [],
	parentCommentId = null
) => {
	const articleComment = document.createElement('article');
	articleComment.className = 'comment';

	if (!commentData.replies) {
		const replyLine = document.createElement('div');
		replyLine.className = 'reply-line';
		replyLine.style.height = index === arr.length - 1 ? '98%' : '112%';
		articleComment.appendChild(replyLine);
		articleComment.style.width = '91%';
		articleComment.style.marginLeft = '4em';
	}

	const vote = document.createElement('div');
	vote.className = 'vote';

	const plusImg = document.createElement('img');
	plusImg.src = './images/icon-plus.svg';
	plusImg.alt = 'plus sign';
	plusImg.className = 'plus-sign';
	plusImg.addEventListener('click', () => {
		increaseScore(commentData.id, parentCommentId);
	});

	const score = document.createElement('span');
	score.className = 'score';
	score.textContent = commentData.score;

	const minusImg = document.createElement('img');
	minusImg.src = './images/icon-minus.svg';
	minusImg.alt = 'minus sign';
	minusImg.className = 'minus-sign';
	minusImg.addEventListener('click', () => {
		decreaseScore(commentData.id, parentCommentId);
	});

	const description = document.createElement('div');
	description.className = 'description';
	description.style.width = '100%';

	const heading = document.createElement('div');
	heading.className = 'heading';

	const userContainer = document.createElement('div');
	userContainer.className = 'user-container';

	const userImg = document.createElement('img');
	userImg.src = commentData.user.image.png;
	userImg.alt = 'user avatar';
	userImg.className = 'comment-user-image';

	const userName = document.createElement('b');
	userName.textContent = commentData.user.username;

	const timeStamp = document.createElement('span');
	timeStamp.textContent = commentData.createdAt;

	userContainer.appendChild(userImg);
	userContainer.appendChild(userName);
	if (commentData.user.username === currentUser.username) {
		const commentOwner = document.createElement('div');
		commentOwner.textContent = 'you';
		commentOwner.className = 'comment-owner';
		userContainer.appendChild(commentOwner);
	}
	userContainer.appendChild(timeStamp);

	heading.appendChild(userContainer);

	if (commentData.user.username === currentUser.username) {
		const deleteEditContainer = document.createElement('div');
		deleteEditContainer.className = 'delete-edit';

		const deleteIcon = document.createElement('img');
		deleteIcon.src = './images/icon-delete.svg';
		deleteIcon.className = 'delete-icon';

		const deleteSpan = document.createElement('span');
		deleteSpan.textContent = 'Delete';
		deleteSpan.className = 'delete-span';

		const deleteContainer = document.createElement('div');
		deleteContainer.className = 'delete-container';
		deleteContainer.appendChild(deleteIcon);
		deleteContainer.appendChild(deleteSpan);

		deleteContainer.addEventListener('mouseover', () => {
			deleteIcon.src = './images/icon-delete-light.svg';
		});
		deleteContainer.addEventListener('mouseout', () => {
			deleteIcon.src = './images/icon-delete.svg';
		});
		deleteContainer.addEventListener('click', () => {
			deleteModal.style.display = 'block';
			overlay.style.display = 'block';
			replyId = commentData.id;
			commentId = parentCommentId;
			updatePage();
		});

		const editIcon = document.createElement('img');
		editIcon.src = './images/icon-edit.svg';
		editIcon.className = 'edit-icon';

		const editSpan = document.createElement('span');
		editSpan.textContent = 'Edit';
		editSpan.className = 'edit-span';

		const editContainer = document.createElement('div');
		editContainer.className = 'edit-container';
		editContainer.appendChild(editIcon);
		editContainer.appendChild(editSpan);

		editContainer.addEventListener('mouseover', () => {
			editIcon.src = './images/icon-edit-light.svg';
		});
		editContainer.addEventListener('mouseout', () => {
			editIcon.src = './images/icon-edit.svg';
		});
		// ---------------------------------------------------------------------------------------
		editContainer.addEventListener('click', () => {
			const commentOrReply = comments.find(
				(item) => item.id === parentCommentId
			);
			const reply = commentOrReply.replies.find(
				(item) => item.id === commentData.id
			);
			reply['editReply'] = true;
			updatePage();
		});

		deleteEditContainer.appendChild(deleteContainer);
		deleteEditContainer.appendChild(editContainer);

		heading.appendChild(deleteEditContainer);
	} else {
		const replyContainer = document.createElement('div');
		replyContainer.className = 'reply-container';

		const replyIcon = document.createElement('img');
		replyIcon.src = './images/icon-reply.svg';
		replyIcon.className = 'reply-icon';

		replyContainer.addEventListener('mouseover', () => {
			replyIcon.src = './images/icon-reply-light.svg';
		});
		replyContainer.addEventListener('mouseout', () => {
			replyIcon.src = './images/icon-reply.svg';
		});

		replyContainer.addEventListener('click', () => {
			const commentOrReply = comments.find(
				(item) => item.id === commentData.id
			);
			commentOrReply['draftReply'] = true;
			//	currentUserAction('reply', commentData.id);
			updatePage();
		});
		// ------------------------------------------------------------------------------------------------

		const replySpan = document.createElement('span');
		replySpan.textContent = 'Reply';
		replySpan.className = 'reply-span';

		heading.appendChild(replyContainer);

		replyContainer.appendChild(replyIcon);
		replyContainer.appendChild(replySpan);
	}

	articleComment.appendChild(vote);

	vote.appendChild(plusImg);
	vote.appendChild(score);
	vote.appendChild(minusImg);

	articleComment.appendChild(description);

	description.appendChild(heading);
	// --------------------------------------------------------------------------------------------------------

	if (commentData?.editReply) {
		const textArea = document.createElement('textarea');
		textArea.textContent = `@${commentData.replyingTo}, ${commentData.content}`;
		textArea.className = 'user-edit-text-area';
		description.appendChild(textArea);

		const divBtn = document.createElement('div');
		divBtn.style.textAlign = 'right';
		divBtn.style.marginTop = '0.7em';
		const updateButton = document.createElement('button');
		updateButton.textContent = 'Update';
		updateButton.className = 'send-reply';
		divBtn.appendChild(updateButton);
		description.appendChild(divBtn);
	} else {
		const commentText = document.createElement('p');
		if (commentData?.replyingTo) {
			const replyingToSpan = document.createElement('span');
			replyingToSpan.textContent = `@${commentData.replyingTo} `;
			replyingToSpan.className = 'replying-to-span';
			const replyTextSpan = document.createElement('span');
			replyTextSpan.textContent = commentData.content;
			commentText.appendChild(replyingToSpan);
			commentText.appendChild(replyTextSpan);
		} else {
			commentText.textContent = commentData.content;
		}
		commentText.style.paddingTop = '1em';
		description.appendChild(commentText);
	}
	// ----------------------------------------------------------------------------------------------

	main.appendChild(articleComment);
	// ------------------------------------------------------------------------------------------------------------
	if (commentData?.draftReply) {
		currentUserAction('reply', commentData.id, commentData.user.username);
		// 	commentData.draftReply = false;
	}

	if (commentData?.replies?.length > 0) {
		commentData.replies.forEach((reply, index, arr) => {
			createComment(reply, index, arr, commentData.id);
		});
	}
};

const displayComments = (comments) => {
	comments.forEach((comment) => {
		createComment(comment);
	});
};

const createReply = (type, content, toId, user) => {
	const toCommentOrReply = comments.find((item) => item.draftReply);
	const editedContent = content.split(' ').slice(1).join(' ');
	const newReply = {
		id: ++lastId,
		content: editedContent,
		createdAt: new Date().toDateString(),
		score: 0,
		replyingTo: toCommentOrReply.user.username,
		user: {
			...currentUser,
		},
	};
	toCommentOrReply.replies.push(newReply);
	delete toCommentOrReply.draftReply;
	console.log(toCommentOrReply);
	updatePage();
};

const currentUserAction = (type, commentOrReplyId = 0, userName = null) => {
	const article = document.createElement('article');
	article.className = 'user-comment-section';

	const userImg = document.createElement('img');
	userImg.src = currentUser.image.png;
	userImg.alt = 'user avatar';
	userImg.className = 'user-image';

	const textArea = document.createElement('textarea');
	textArea.placeholder = 'Add a comment...';
	textArea.textContent = userName ? `@${userName}, ` : '';
	textArea.className = 'user-text-area';

	const sendOrReplyButton = document.createElement('button');
	sendOrReplyButton.textContent = type;
	sendOrReplyButton.className = 'send-reply';

	sendOrReplyButton.addEventListener('click', () => {
		createReply(type, textArea.value, commentOrReplyId, userName);
	});

	article.appendChild(userImg);
	article.appendChild(textArea);
	article.appendChild(sendOrReplyButton);
	main.appendChild(article);
};

displayComments(comments);
currentUserAction('send');
main.appendChild(deleteModal);
