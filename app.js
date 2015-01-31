window.addEventListener("load", function () {
    var canvas = document.getElementById("viewport");
    var context = canvas.getContext("2d");

    console.log("Creating new Application object");

    var app = new Application(canvas, context);
    app.Start();
}, false);

var BrushTypeEnum = {
    circle: 0,
    rect: 1
};

var Application = function (canvas, context) {
    return {
        canvas: canvas,
        context: context,
        lastUpdateTime: undefined,
        mouse: {
            position: {
                x: 0,
                y: 0
            },
            isDown: false
        },
        brush: {
            color: "red",
            radius: 10,
            type: BrushTypeEnum.circle
        },

        CalculateMousePosition: function (event) {
            var rect = this.canvas.getBoundingClientRect();

            this.mouse.position.x = event.clientX - rect.left;
            this.mouse.position.y = event.clientY - rect.top;
        },

        Start: function () {
            console.log("Starting application");

            this.lastUpdateTime = Date.now();
            this.RegisterMouseEvents();
            this.RegisterSettingsEvents();
            this.DoFrame();
        },

        RegisterSettingsEvents: function () {
            document.getElementById("brush-apply").addEventListener("click", function (event) {
                this.brush.color = document.getElementById("brush-color").value;
                this.brush.radius = document.getElementById("brush-radius").value | 0;

                switch (document.getElementById("brush-type").value | 0) {
                    case 0:
                        this.brush.type = BrushTypeEnum.circle;
                        break;
                    case 1:
                        this.brush.type = BrushTypeEnum.rect;
                        break;
                }
            }.bind(this));
        },

        RegisterMouseEvents: function () {
            this.canvas.addEventListener("mousemove", function (event) {
                this.CalculateMousePosition(event);
            }.bind(this), false);

            this.canvas.addEventListener("mousedown", function (event) {
                this.mouse.isDown = true;
                this.CalculateMousePosition(event);
            }.bind(this));

            this.canvas.addEventListener("mouseup", function (event) {
                this.mouse.isDown = false;
                this.CalculateMousePosition(event);
            }.bind(this));
        },

        Update: function (deltaTime) {
        },

        Draw: function () {
            if (this.mouse.isDown) {
                if(this.brush.type == BrushTypeEnum.circle) {
                    this.DrawFilledCircle(this.mouse.position, this.brush.radius, this.brush.color);
                }

                if(this.brush.type == BrushTypeEnum.rect) {
                    this.DrawFilledRect(this.mouse.position, this.brush.radius, this.brush.radius, this.brush.color);
                }
            }

            // Draw coloring every frame - coloring needs to be on top of user drawing
            // Alt you can use second canvas or image element over canvas
            this.context.drawImage(document.getElementById("canvas-coloring-source"), 0, 0, 800, 600);
        },

        DrawFilledCircle: function (position, radius, color) {
            this.context.beginPath();
            this.context.arc(position.x, position.y, radius, 0, Math.PI * 2, true);
            this.context.closePath();
            this.context.fillStyle = color;
            this.context.fill();
        },

        DrawFilledRect: function (position, width, height, color) {
            this.context.beginPath();
            this.context.rect(position.x - (width / 2), position.y - (height / 2), width, height);
            this.context.closePath();
            this.context.fillStyle = color;
            this.context.fill();
        },

        DoFrame: function () {
            var deltaTime = (Date.now() - this.lastUpdateTime) | 0;
            this.lastUpdateTime = Date.now();

            this.Update(deltaTime);
            this.Draw();

            window.requestAnimationFrame(this.DoFrame.bind(this));
        }
    };
};
