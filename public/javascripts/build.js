(function() {
	var socket;
	/**
	  *  清屏函数
	  **/
	var cleanScreen = function() {
		$('#chat-dynamic').empty();
		$('#chat-dynamic').append("<p style='font-weight:bold;font-size:20px;text-align:center;')> 系统：欢迎来到聊天室大厅</p>");
	};
	/**
	  *  消息发送函数
	  **/
	var sendMessage = function() {
		var username = 'test';
		var date = new Date(),
			time;
		var hour = date.getHours(),
			minute = date.getMinutes(),
			seconds = date.getSeconds();
		var hour_str = (hour > 9) ? hour.toString() : ('0' + hour.toString()),
			minute_str = (minute > 9) ? minute.toString() : ('0' + minute.toString()),
			seconds_str = (seconds > 9) ? seconds.toString() : ('0' + seconds.toString());
		var content = $('#message-box input').val();

		// if(content === '') {
		// 	alert('消息内容不能为空');
		// 	return;
		// }

		if (hour > 12) {
			time = hour_str + ':' + minute_str + ':' + seconds_str + '  PM';
		} else {
			time = hour_str + ':' + minute_str + ':' + seconds_str + '  AM';
		}

		var message = {
			username: username,
			time: time,
			content: content
		};

		socket.emit('chat', message);
		$('#message-box input').val('');
	};

	/**
	  *  发送消息
	  **/
	if (window.location.href === 'http://172.18.34.13:3000/chat') {
		socket = io.connect('172.18.34.13:3000');
		//按下Enter
		$('#message-box input').keydown(function(e) {
			if (e.keyCode === 13) {
				$('#send-message').click();
			}
		});
		//点击发送按钮
		$('#send-message').click(function() {
			sendMessage();
		});
		//滚动条自动滚动
		socket.on('chat', function(message) {
			$('#chat-dynamic').append('<p><b>(' + message.time + ') ' + message.username + ' : </b>' + message.content + '</p>');
			var scrollHeight = $('#chat-dynamic').height() - $('#chat-box').height();
			$('#chat-box').scrollTop(scrollHeight);
		});
	}

	/**
	  *  清除屏幕现有消息
	  **/
	//按下Esc
	$('body').keydown(function(e) {
		if(e.keyCode === 27) {
			$('#clean-box').click();
		}
	});
	//点击清屏按钮
	$('#clean-box').on('click', cleanScreen);
})();;(function() {
    $('#test').click(function() {
        alert('success');
    });
})();;(function() {
	//用户注册逻辑
	$('#register-apply').click(function() {
		var username = $('#register-username input').val();
		var password = $('#register-password input').val();
		var re_password = $('#register-password-repeat input').val();
		var user = {
			username: username,
			password: password
		};
		var socket = io.connect('localhost:3000');
		//信息完整性判断
		if (username === '') {
			alert('用户名不能为空');
			return;
		}

		if (password === '') {
			alert('密码不能为空');
			return;
		}

		if (password !== re_password) {
			alert('两次输入密码不一致');
			return;
		}

		socket.emit('register', user);

		console.log(user);

		socket.on('register success', function() {
			alert('注册成功');
			window.location = '/chat';
		});

		socket.on('register failed', function() {
			alert('注册失败');
			window.location = '/register';
		});
	});
})();