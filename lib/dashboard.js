const blessed = require('blessed')
const contrib = require('blessed-contrib')
const monitor = require('./monitor')

const screen = blessed.screen()

const grid = new contrib.grid({
  rows: 12,
  cols: 12,
  screen: screen
})

let cpuLine = grid.set(0, 0, 4, 12, contrib.line, {
  showNthLabel: 5,
  maxY: 100,
  label: 'CPU History',
  showLegend: true,
})

var diskDonut = grid.set(10, 0, 2, 6, contrib.donut, {
  radius: 8,
  arcWidth: 3,
  yPadding: 2,
  remainColor: 'black',
  label: 'Disk usage',
})

screen.render()
screen.on('resize', function(a) {
  cpuLine.emit('attach')
  diskDonut.emit('attach')
})

screen.key(['escape', 'q', 'C-c'], function(ch, key) {
  return process.exit(0);
})

function init() {
  new monitor.Cpu(cpuLine) //no Windows support
  new monitor.Disk(diskDonut)
}

process.on('uncaughtException', function(err) {
  // avoid exiting due to unsupported system resources in Windows
})

module.exports = {
  init: init,
  monitor: monitor
}
