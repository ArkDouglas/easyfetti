import { useEffect, useRef, useState } from 'react'

import Confetti from 'react-confetti'

import { Box, Button, Slider, TextField, Typography } from '@mui/material'

const ConfettiBuilder = () => {
	const [drawCode, setDrawCode] = useState('')
	const [numberOfPieces, setNumberOfPieces] = useState(10)
	const [size, setSize] = useState(10)
	const [dimensions, setDimensions] = useState({ width: 500, height: 500 })
	const canvasRef = useRef(null)

	useEffect(() => {
		if (typeof window !== 'undefined') {
			const updateDimensions = () => {
				setDimensions({
					width: window.innerWidth / 2,
					height: window.innerHeight,
				})
			}
			updateDimensions()
			window.addEventListener('resize', updateDimensions)
			return () => window.removeEventListener('resize', updateDimensions)
		}
	}, [])

	const drawShape = (ctx) => {
		try {
			ctx.save()
			const func = new Function('ctx', `${drawCode}`)
			func(ctx)
			ctx.restore()
		} catch (error) {
			console.error('Error in custom draw function:', error)
		}
	}

	const handleSizeChange = (event, newValue) => {
		setSize(newValue)
	}

	const handleSliderChange = (event, newValue) => {
		setNumberOfPieces(newValue)
	}

	const updateCanvas = () => {
		const canvas = canvasRef.current
		const ctx = canvas.getContext('2d')
		const { width, height } = canvas

		ctx.clearRect(0, 0, width, height) // Clear the canvas before redrawing
		ctx.save() // Save the current state of the canvas

		// Create an off-screen canvas to calculate bounding box
		const offScreenCanvas = document.createElement('canvas')
		const offCtx = offScreenCanvas.getContext('2d')
		offScreenCanvas.width = width
		offScreenCanvas.height = height
		offCtx.scale(size / 10, size / 10)

		// Execute the drawing code on the off-screen canvas
		try {
			const func = new Function('ctx', `${drawCode}`)
			func(offCtx)
		} catch (error) {
			console.error('Error in custom draw function:', error)
		}

		// Get bounding box
		const imgData = offCtx.getImageData(
			0,
			0,
			offScreenCanvas.width,
			offScreenCanvas.height,
		)
		let minX = imgData.width,
			minY = imgData.height,
			maxX = 0,
			maxY = 0
		for (let y = 0; y < imgData.height; y++) {
			for (let x = 0; x < imgData.width; x++) {
				const alpha = imgData.data[(y * imgData.width + x) * 4 + 3]
				if (alpha > 0) {
					if (x < minX) minX = x
					if (y < minY) minY = y
					if (x > maxX) maxX = x
					if (y > maxY) maxY = y
				}
			}
		}
		const bboxWidth = maxX - minX
		const bboxHeight = maxY - minY

		// Calculate the scale to fit the shape fully in the canvas while maintaining aspect ratio
		const scaleX = width / bboxWidth
		const scaleY = height / bboxHeight
		const scale = Math.min(scaleX, scaleY)

		// Translate to center the shape in the canvas
		ctx.translate(width / 2, height / 2)
		ctx.scale(scale, scale)
		ctx.translate(-minX - bboxWidth / 2, -minY - bboxHeight / 2)

		// Execute the drawing code dynamically evaluated from the text input
		try {
			const func = new Function('ctx', `${drawCode}`)
			func(ctx)
		} catch (error) {
			console.error('Error in custom draw function:', error)
		}

		ctx.restore() // Restore the context to its original state
	}

	const loadShape = (shape) => {
		const shapes = {
			fox: `    ctx.beginPath();
    
           
            ctx.moveTo(0, 0); // Top of the head
            
        
            ctx.lineTo(-10, -10); 
            ctx.lineTo(-5, 0);
            
           
            ctx.lineTo(-10, 10);
            ctx.lineTo(-3, 15);
            
          
            ctx.lineTo(0, 20);
            
        
            ctx.lineTo(3, 15);
            ctx.lineTo(10, 10);
            
         
            ctx.lineTo(5, 0);
            ctx.lineTo(10, -10);
            
            
            ctx.lineTo(0, 0);
            
            ctx.stroke();
            ctx.closePath();`,
			spiral: `ctx.beginPath();
                for(let i = 0; i < 20; i++) {
                    const angle = 0.1 * i;
                    const x = (5 + (12.5 * angle)) * Math.cos(angle);
                    const y = (5 + (12.5 * angle)) * Math.sin(angle);
                    ctx.lineTo(x + 100, y + 100);
                }
                ctx.stroke();
                ctx.closePath();`,
			heart: `ctx.beginPath();
                ctx.moveTo(75, 40);
                ctx.bezierCurveTo(75, 37, 70, 25, 50, 25);
                ctx.bezierCurveTo(20, 25, 20, 62.5, 20, 62.5);
                ctx.bezierCurveTo(20, 80, 40, 102, 75, 120);
                ctx.bezierCurveTo(110, 102, 130, 80, 130, 62.5);
                ctx.bezierCurveTo(130, 62.5, 130, 25, 100, 25);
                ctx.bezierCurveTo(85, 25, 75, 37, 75, 40);
                ctx.fill();`,
			star: `ctx.beginPath();
                ctx.moveTo(108, 0.0);
                ctx.lineTo(141, 70);
                ctx.lineTo(218, 78.3);
                ctx.lineTo(162, 131);
                ctx.lineTo(175, 205);
                ctx.lineTo(108, 170);
                ctx.lineTo(41.2, 205);
                ctx.lineTo(55, 131);
                ctx.lineTo(1, 78);
                ctx.lineTo(75, 68.3);
                ctx.lineTo(108, 0);
                ctx.closePath();
                ctx.fill();`,
		}
		setDrawCode(shapes[shape])
	}

	return (
		<Box display="flex" justifyContent="space-between" p={2}>
			<Box width="45%" p={2} border="1px solid gray" borderRadius="8px">
				<Typography variant="h6">Customize Confetti Shape</Typography>
				<TextField
					multiline
					fullWidth
					rows={10}
					value={drawCode}
					onChange={(e) => setDrawCode(e.target.value)}
					variant="outlined"
					placeholder="Enter drawing code here or use the buttons below to load predefined shapes."
					margin="normal"
				/>
				<Button
					onClick={() => loadShape('fox')}
					variant="contained"
					color="primary"
					sx={{ mr: 1 }}
				>
					Fox
				</Button>
				<Button
					onClick={() => loadShape('spiral')}
					variant="contained"
					color="primary"
					sx={{ mr: 1 }}
				>
					Spiral
				</Button>
				<Button
					onClick={() => loadShape('heart')}
					variant="contained"
					color="primary"
					sx={{ mr: 1 }}
				>
					Heart
				</Button>
				<Button
					onClick={() => loadShape('star')}
					variant="contained"
					color="primary"
					sx={{ mr: 1 }}
				>
					Star
				</Button>
				<Typography gutterBottom>Number of Pieces</Typography>
				<Slider
					value={numberOfPieces}
					onChange={handleSliderChange}
					aria-labelledby="confetti-piece-slider"
					valueLabelDisplay="auto"
					step={10}
					marks
					min={10}
					max={1000}
				/>
				<Typography gutterBottom>Size of Confetti</Typography>
				<Slider
					value={size}
					onChange={handleSizeChange}
					aria-labelledby="confetti-size-slider"
					valueLabelDisplay="auto"
					step={1}
					marks
					min={1}
					max={20}
				/>
				<Button onClick={updateCanvas} variant="contained" color="secondary">
					Update Confetti
				</Button>
				<canvas
					ref={canvasRef}
					width={200}
					height={200}
					style={{ border: '1px solid black', marginTop: '20px' }}
				/>
			</Box>

			<Box
				width="50%"
				height="100vh"
				sx={{ position: 'relative', overflow: 'hidden' }}
			>
				<Confetti
					width={dimensions.width}
					height={dimensions.height}
					numberOfPieces={numberOfPieces}
					recycle={true}
					run={true}
					drawShape={drawShape}
				/>
			</Box>
		</Box>
	)
}

export default ConfettiBuilder
