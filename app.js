window.addEventListener("load", function () {
    var canvas = document.getElementById("viewport");
    var context = canvas.getContext("2d");

    console.log("Creating new Application object");

    var app = new Application(canvas, context);
    app.Start();
}, false);

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
            radius: 10
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
                this.DrawFilledCircle(this.mouse.position, this.brush.radius, this.brush.color);
            }
        },

        DrawFilledCircle: function (position, radius, color) {
            this.context.beginPath();
            this.context.arc(position.x, position.y, radius, 0, Math.PI * 2, true);
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
