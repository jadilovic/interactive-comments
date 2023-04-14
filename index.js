import data from './data.json' assert { type: 'json' };
const main = document.querySelector('main');
const article = document.createElement('article');
const userImg = document.createElement('img');
const textArea = document.createElement('textarea');
const sendButton = document.createElement('button');
const { currentUser, comments } = data;

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
	displayComments(comments);
	displayCurrentUser();
};

const createComment = (
	commentData,
	index = 0,
	arr = [],
	parentCommentId = null
) => {
	const articleComment = document.createElement('article');
	articleComment.className = 'comment';
	articleComment.style.display = 'flex';
	articleComment.style.backgroundColor = 'white';
	articleComment.style.borderRadius = '1em';
	articleComment.style.padding = '1em';
	articleComment.style.marginBottom = '1em';
	articleComment.style.position = 'relative';
	console.log(commentData.replies);
	if (!commentData.replies) {
		const replyLine = document.createElement('div');
		replyLine.className = 'reply-line';
		replyLine.style.height = index === arr.length - 1 ? '98%' : '112%';
		articleComment.appendChild(replyLine);
		articleComment.style.width = '91%';
		articleComment.style.marginLeft = '4em';
	} else {
		articleComment.style.width = '100%';
	}
	const vote = document.createElement('div');
	vote.className = 'vote';
	vote.style.width = '5%';
	vote.style.display = 'flex';
	vote.style.flexDirection = 'column';
	vote.style.justifyContent = 'flex-start';
	vote.style.backgroundColor = 'hsl(228, 33%, 97%)';
	vote.style.marginRight = '1em';
	vote.style.borderRadius = '0.4em';
	const plusImg = document.createElement('img');
	plusImg.src = './images/icon-plus.svg';
	plusImg.alt = 'plus sign';
	plusImg.style.padding = '0.5em 0.7em 1em';
	plusImg.style.cursor = 'pointer';
	const score = document.createElement('span');
	score.className = 'score';
	score.textContent = commentData.score;
	score.style.textAlign = 'center';
	score.style.color = 'hsl(238, 40%, 52%)';
	score.style.fontWeight = '500';
	const minusImg = document.createElement('img');
	minusImg.src = './images/icon-minus.svg';
	minusImg.alt = 'minus sign';
	minusImg.style.padding = '1em 0.7em';
	minusImg.style.cursor = 'pointer';
	plusImg.addEventListener('click', () => {
		increaseScore(commentData.id, parentCommentId);
	});
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
	userImg.style.width = '2em';
	userImg.style.height = '2em';
	const userName = document.createElement('b');
	userName.textContent = commentData.user.username;
	const timeStamp = document.createElement('span');
	timeStamp.textContent = commentData.createdAt;
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
	const replySpan = document.createElement('span');
	replySpan.textContent = 'Reply';
	replySpan.className = 'reply-span';
	const commentText = document.createElement('p');
	commentText.textContent = commentData.content;
	commentText.style.paddingTop = '1em';
	articleComment.appendChild(vote);
	vote.appendChild(plusImg);
	vote.appendChild(score);
	vote.appendChild(minusImg);
	articleComment.appendChild(description);
	description.appendChild(heading);
	userContainer.appendChild(userImg);
	userContainer.appendChild(userName);
	userContainer.appendChild(timeStamp);
	heading.appendChild(userContainer);
	heading.appendChild(replyContainer);
	replyContainer.appendChild(replyIcon);
	replyContainer.appendChild(replySpan);
	description.appendChild(commentText);
	main.appendChild(articleComment);

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

const displayCurrentUser = () => {
	article.style.backgroundColor = 'white';
	article.style.borderRadius = '1em';
	article.style.width = '100%';
	article.style.display = 'flex';
	article.style.justifyContent = 'space-between';
	article.style.padding = '1.5em';

	userImg.src = currentUser.image.png;
	userImg.alt = 'user avatar';
	userImg.style.width = '3em';
	userImg.style.height = '3em';

	textArea.style = '';
	textArea.placeholder = 'Add a comment...';
	textArea.style.width = '75%';
	textArea.style.height = '7em';
	textArea.style.margin = '0 1em';
	textArea.classList.add('custom-placeholder');
	textArea.style.borderRadius = '1em';
	textArea.style.padding = '1em 1.5em';
	textArea.style.border = '1px solid lightgrey';

	sendButton.textContent = 'Send';
	sendButton.style.width = '15%';
	sendButton.style.height = '3em';
	sendButton.style.border = 'none';
	sendButton.style.color = 'white';
	sendButton.style.backgroundColor = 'hsl(238, 40%, 52%)';
	sendButton.style.textTransform = 'uppercase';
	sendButton.style.fontWeight = '700';
	sendButton.style.borderRadius = '0.4em';

	article.appendChild(userImg);
	article.appendChild(textArea);
	article.appendChild(sendButton);
	main.appendChild(article);
};

displayComments(comments);
displayCurrentUser();
