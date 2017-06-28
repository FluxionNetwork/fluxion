TARGET = ui/fluxion

build-ui: 
	pyuic4 -x $(TARGET).ui -o $(TARGET).py

clean:
	rm -f ui/*.py

