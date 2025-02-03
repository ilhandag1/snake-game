class SnakeGame {
    constructor() {
        // View elements
        this.homeView = document.getElementById('homeView');
        this.gameView = document.getElementById('gameView');
        this.restartView = document.getElementById('restartView');
        
        // Game elements
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.scoreElement = document.getElementById('score');
        this.finalScoreElement = document.getElementById('finalScore');
        this.highScoresList = document.getElementById('highScoresList');
        
        // Set fixed canvas size
        this.canvas.width = 400;
        this.canvas.height = 400;
        
        // Game settings
        this.tileCount = 20;
        this.tileSize = this.canvas.width / this.tileCount;
        this.snake = [{x: 10, y: 10}];
        this.food = null;
        this.direction = 'right';
        this.score = 0;
        this.gameLoop = null;
        this.highScores = this.loadHighScores();
        
        // Buttons
        this.startGameBtn = document.getElementById('startGameBtn');
        this.restartGameBtn = document.getElementById('restartGameBtn');
        
        this.setupEventListeners();
        this.updateHighScoresList();
        this.subscribeToPushNotifications();
    }

    setupEventListeners() {
        // Button listeners
        this.startGameBtn.addEventListener('click', () => this.startGame());
        this.restartGameBtn.addEventListener('click', () => this.startGame());
        
        // Keyboard controls
        document.addEventListener('keydown', (e) => {
            if (!this.gameLoop) return;
            
            switch(e.key) {
                case 'ArrowUp':
                    if (this.direction !== 'down') this.direction = 'up';
                    break;
                case 'ArrowDown':
                    if (this.direction !== 'up') this.direction = 'down';
                    break;
                case 'ArrowLeft':
                    if (this.direction !== 'right') this.direction = 'left';
                    break;
                case 'ArrowRight':
                    if (this.direction !== 'left') this.direction = 'right';
                    break;
            }
        });

        // Touch controls
        let touchStartX = 0;
        let touchStartY = 0;
        
        this.canvas.addEventListener('touchstart', (e) => {
            touchStartX = e.touches[0].clientX;
            touchStartY = e.touches[0].clientY;
            e.preventDefault();
        });

        this.canvas.addEventListener('touchmove', (e) => {
            if (!this.gameLoop) return;

            let touchEndX = e.touches[0].clientX;
            let touchEndY = e.touches[0].clientY;

            let dx = touchEndX - touchStartX;
            let dy = touchEndY - touchStartY;

            if (Math.abs(dx) > Math.abs(dy)) {
                if (dx > 0 && this.direction !== 'left') this.direction = 'right';
                else if (dx < 0 && this.direction !== 'right') this.direction = 'left';
            } else {
                if (dy > 0 && this.direction !== 'up') this.direction = 'down';
                else if (dy < 0 && this.direction !== 'down') this.direction = 'up';
            }

            e.preventDefault();
        });
    }

    showView(viewId) {
        [this.homeView, this.gameView, this.restartView].forEach(view => {
            view.classList.remove('active');
        });
        document.getElementById(viewId).classList.add('active');
    }

    loadHighScores() {
        const scores = localStorage.getItem('snakeHighScores');
        return scores ? JSON.parse(scores) : [];
    }

    saveHighScore(score) {
        this.highScores.push(score);
        this.highScores.sort((a, b) => b - a);
        this.highScores = this.highScores.slice(0, 5);
        localStorage.setItem('snakeHighScores', JSON.stringify(this.highScores));
    }

    updateHighScoresList() {
        this.highScoresList.innerHTML = '';
        this.highScores.forEach((score, index) => {
            const li = document.createElement('li');
            li.textContent = `${index + 1}. ${score} points`;
            this.highScoresList.appendChild(li);
        });
    }

    generateFood() {
        return {
            x: Math.floor(Math.random() * this.tileCount),
            y: Math.floor(Math.random() * this.tileCount)
        };
    }

    async foodEaten() {
        if ('vibrate' in navigator) {
            navigator.vibrate(200);
        }

        if ('Notification' in window && Notification.permission === 'default') {
            await Notification.requestPermission();
        }

        if (this.score > 0 && this.score % 50 === 0 && 
            'Notification' in window && Notification.permission === 'granted') {
            new Notification('High Score!', {
                body: `You've reached ${this.score} points!`,
                icon: 'icons/icon-192x192.png'
            });
        }
    }

    update() {
        const head = {...this.snake[0]};
        
        switch(this.direction) {
            case 'up': head.y--; break;
            case 'down': head.y++; break;
            case 'left': head.x--; break;
            case 'right': head.x++; break;
        }

        // Check wall collision
        if (head.x < 0 || head.x >= this.tileCount ||
            head.y < 0 || head.y >= this.tileCount ||
            this.snake.some(segment => segment.x === head.x && segment.y === head.y)) {
            this.gameOver();
            return;
        }

        this.snake.unshift(head);

        if (head.x === this.food.x && head.y === this.food.y) {
            this.score += 10;
            this.scoreElement.textContent = this.score;
            this.food = this.generateFood();
            this.foodEaten();
        } else {
            this.snake.pop();
        }
    }

    draw() {
        // Clear canvas
        this.ctx.fillStyle = '#f0f0f0';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw snake
        this.ctx.fillStyle = '#4CAF50';
        this.snake.forEach(segment => {
            this.ctx.fillRect(
                segment.x * this.tileSize,
                segment.y * this.tileSize,
                this.tileSize - 1,
                this.tileSize - 1
            );
        });

        // Draw food
        this.ctx.fillStyle = '#e74c3c';
        this.ctx.fillRect(
            this.food.x * this.tileSize,
            this.food.y * this.tileSize,
            this.tileSize - 1,
            this.tileSize - 1
        );
    }

    gameOver() {
        clearInterval(this.gameLoop);
        this.gameLoop = null;
        this.saveHighScore(this.score);
        this.finalScoreElement.textContent = this.score;
        this.updateHighScoresList();
        this.showView('restartView');
    }

    startGame() {
        this.snake = [{x: 10, y: 10}];
        this.direction = 'right';
        this.score = 0;
        this.scoreElement.textContent = '0';
        this.food = this.generateFood();
        
        if (this.gameLoop) clearInterval(this.gameLoop);
        
        this.showView('gameView');
        this.gameLoop = setInterval(() => {
            this.update();
            this.draw();
        }, 150); // Slightly slower for better control
    }

    async subscribeToPushNotifications() {
        if ('serviceWorker' in navigator && 'PushManager' in window) {
            try {
                const registration = await navigator.serviceWorker.ready;
                const subscription = await registration.pushManager.subscribe({
                    userVisibleOnly: true,
                    applicationServerKey: 'BNPiGGOR8tROA7_oH9PoIAK-wjxLfMc7b79Ds3A6MC4-wxoendFfEhY-y5U5Zowo2USWuCU8O9RZNNm_DdSz_9E'
                });
                console.log('Push subscription:', subscription);
                // Send subscription to server to save it
            } catch (error) {
                console.error('Push subscription failed:', error);
            }
        }
    }
}

// Initialize game
const game = new SnakeGame();