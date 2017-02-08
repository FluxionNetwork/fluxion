#!/usr/bin/env python

import sys
import getopt
import os
import subprocess

site_name = ''
site_language = ''
installed_sites = 0
flux_cont = ''


def main(argv):
	global site_name, site_language
	if os.geteuid() != 0:
		exit("You need to have root privileges to run this script.\nPlease try again, this time using 'sudo'. Exiting....")
		sys.exit()
	usage = '>>>\tUsage:\n' +'\t\tsiteinstaller.pyc -f <filename>' +'\n\t\tsiteinstaller.pyc --file <file>\n\n>>>\tOnly *.tar.gz compressed files!'
	try:
		opts, args = getopt.getopt(sys.argv[1:], 'f:h', ['file=', 'help'])
		if(len(opts) <= 0):
			print(usage)
			sys.exit()
	except getopt.GetoptError:
		print(usage)
		sys.exit(2)
	
	for opt, arg in opts:
		if opt in ('-h', '--help'):
			print(usage)
			sys.exit(2)
		elif opt in ('-f', '--file'):
			if not('.tar.gz' in arg):
				print('ONLY *.tar.gz files supported. Sorry bro')
				sys.exit()
			if(os.path.isfile(arg) == False):
				print('Your file does not exist, maybe a typo?')
				sys.exit()
			site_name = arg[:arg.rfind('.tar.gz')]
			site_language = site_name[site_name.rfind('_')+1:]
		else:
			print(usage)
		

if __name__ == "__main__":
   main(sys.argv[1:])

def check_fluxion():
	global installed_sites, flux_cont
	try:
		fl = open('fluxion','rw')
		flux_cont = fl.read()
		fl.close()
	except:
		print('Could not open fluxion, check permissions. Exiting...')
		sys.exit()
	if(flux_cont <= 100):
		print('No fluxion installation found.\nPlease use this installer INSIDE the fluxion folder. Exiting...')
		sys.exit()
	flv = ''
	flr = ''
	fld = ''
	if('version=' in flux_cont) and ('revision=' in flux_cont):
		flv = flux_cont[flux_cont.find('version=')+8:]
		flv = flv[:flv.find('\n')]
		flr = flux_cont[flux_cont.find('revision=')+9:]
		flr = flr[:flr.find('\n')]
	else:
		print('Corrupted fluxion installation. Exiting...')
		sys.exit()
	
	installed_sites = int(flux_cont.count('elif [ "$fluxass" ='))
	fls = str(installed_sites + 1)
	
	# Check on double installation!
	fld = flux_cont[flux_cont.find('$DUMP_PATH/data/index.htm'):]
	if(site_name in fld):
		usdc = raw_input('Seems like there is already a site with the name "' + site_name + '" Do you want to continue anyway? [Y\\n]')
		if(len(usdc) <= 0) or (usdc == 'y') or (usdc == 'yes'):
			pass
		else:			
			sys.exit()
	return flv + '#' + flr + '#' + fls

def welcome():
	flc = check_fluxion().split('#')
	wsn = int(22 - len(site_name))
	whitespacen = ''
	wsl = int((22+6) - len(site_language))
	whitespacel = ''
	for i in xrange(wsn):
		whitespacen += ' '
		if(i+1 == wsn) and (i+1 <= wsn):
			whitespacen += '#'
	for i in xrange(wsl):
		whitespacel += ' '
		if(i+1 == wsl) and (i+1 <= wsl):
			whitespacel += '#'
	
	print(' # ############################################')
	print(' #        FluxIon - Site Installer v0.10      #')
	print(' # ############################################')
	print('')
	print(' # ############## Fluxion found! ##############')
	print(' # Version: '+ flc[0] +'                              #')
	print(' # Revision: '+ flc[1] +'                              #')
	print(' # Installed Sites: '+ flc[2] +'                        #')
	print(' # ############################################')
	print('')
	print(' # ############################################')
	print(' # SiteName to install: ' + site_name + whitespacen)
	print(' # Language flag: ' + site_language + whitespacel)
	print(' # ############################################')
	print('')
	print(' # ########### Everything correct? ############')
	print('')
	usc = raw_input(' # Begin installation? [Y\\n]').lower()
	
	if(len(usc) <= 0) or (usc == 'y') or (usc == 'yes'):
		pass
	else:
		print('\n\t # Nothing changed, your choice. Exiting...')
		sys.exit()

welcome()

def insert_at_secondlast_pos1():
	global flux_cont, site_name, site_language
	whitespaces = ''
	search_string = 'echo -e "      "$red"["$yellow"$n"$red"]"$transparent"\e'
	ws = int(12 - len(site_name))
	for i in xrange(ws):
		whitespaces+=' '
	insert_site = 'echo -e "      "$red"["$yellow"$n"$red"]"$transparent" ' + site_name + whitespaces + '[' + site_language + '] ";n=` expr $n + 1`\n'
	before = flux_cont[:int(flux_cont.rfind(search_string))]
	after = '\t\t\t' + flux_cont[int(flux_cont.rfind(search_string)):]
	flux_cont = before + insert_site + after

def insert_at_secondlast_pos2():
	global installed_sites, flux_cont, site_name
	site_number = str(installed_sites +1)
	insert_site = 'elif [ "$fluxass" = "'+ site_number +'" ]; then\n\t\t\t\t' + site_name + '\n\t\t\t\tbreak\n\n\t\t\t'
	flux_cont = flux_cont[:int(flux_cont.rfind('elif [ "$fluxass" ='))] + insert_site + flux_cont[int(flux_cont.rfind('elif [ "$fluxass" =')):]

def last_option_correct_number2():
	global installed_sites, flux_cont
	acc = int(flux_cont.rfind('elif [ "$fluxass" ='))
	acc0 = int(flux_cont[acc:].find('" = "')+5)
	before = flux_cont[:acc+acc0]
	after = flux_cont[acc+acc0+2:]
	flux_cont = before + str(installed_sites+2) + after

def insert_at_last_pos3():
	global flux_cont, site_name
	insert_site = '\n\nfunction ' + site_name + ' {\n\tmkdir $DUMP_PATH/data &>$flux_output_device\n\tcp $WORK_DIR/Sites/' + site_name + '/* $DUMP_PATH/data\n\t}'
	before = flux_cont[:int(flux_cont.rfind('}'))+1]
	after = flux_cont[int(flux_cont.rfind('}'))+1:]
	flux_cont = before + insert_site + after

print('')
print(' # Creating backup...')
try:
	subprocess.Popen(['cp','fluxion', 'bckp_fluxion'])
except:
	print('No Permission')
	sys.exit()
print(' # Done!')

print('')
print(' # Copying files...')
try:
	subprocess.Popen(['tar','xfz', site_name+'.tar.gz', '-C', 'Sites/'])
except:
	print('Could not copy files...soz')
	sys.exit()
print(' # Done!')

print('')
print(' # Reconfiguring fluxion bash...')
try:
	insert_at_secondlast_pos1()
	insert_at_secondlast_pos2()
	last_option_correct_number2()
	insert_at_last_pos3()
except:
	print('Internal failure... we fucked it up')
	e = sys.exc_info()[0]
	print("Error: %s" % e )
	sys.exit()

print(' # Done!')

print('')
print(' Rewriting fluxion bash...')
try:
	wflux = open('fluxion','w')
	wflux.write(flux_cont)
	wflux.close()
except:
	print('FATAL ERROR[501]...')
	print('Trying to restore from backup')
	try:
		subprocess.Popen(['mv','bckp_fluxion', 'fluxion'])
		print('FluxIon Backup restored...')
	except:
		print('FATAL ERROR[502]... sorry bro something went wrong, fluxion may be broken now...')
	sys.exit()
print(' # Done!')

print('')
print(' # Setting modes...')
try:
	subprocess.Popen(['chmod','755', 'Sites/'+site_name])
	subprocess.Popen(['chmod','644', '-R', 'Sites/'+site_name])
	print(' # Done!')
except:
	print('ERROR[506]... continue...')

print('')
print(' # Verifying integrity of fluxion...')
try:
	fluxit = open('fluxion','r')
	integ_fluxion = fluxit.read()
	fluxit.close()
	if(len(integ_fluxion) == len(flux_cont)):
		print(' # Done!')
		print(' # Deleting backup...')
		subprocess.Popen(['rm','bckp_fluxion'])
	else:
		print('FATAL ERROR[509]... your fluxion might be messed up')
		sys.exit()
except:
	print('FATAL ERROR[503]... sorry bro something went wrong, fluxion may be broken now...')
	sys.exit()

print('\n # Finished, successfully installed "' + site_name + '" to your fluxion!')
	

