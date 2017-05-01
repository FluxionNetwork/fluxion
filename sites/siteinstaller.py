#!/usr/bin/env python
# -*- coding: cp852 -*-

import sys
import getopt
import os
import subprocess
sys.path.insert(0, './locale')

# ###################
# ## OPTIONS ########
# ###################
site_name = ''
site_language = ''
installed_sites = 0
flux_cont = ''
#flux_comp_versions = ['0.24']
flinstall_version = '0.11'
# ###################
class color:
    PURPLE = '\033[95m'
    CYAN = '\033[96m'
    DARKCYAN = '\033[36m'
    BLUE = '\033[94m'
    GREEN = '\033[92m'
    YELLOW = '\033[93m'
    RED = '\033[91m'
    BOLD =  '\033[1m'
    UNDERLINE = '\033[4m'
    END = '\033[0m'

def main(argv):
	global site_name, site_language
	if os.geteuid() != 0:
		exit('You need to have root privileges to run this script.\nPlease try again, this time using \'sudo\'. Exiting....')
		sys.exit()
	usage = '>>>\tUsage:\n' +'\t\tsiteinstaller.py -f <filename>' +'\n\t\tsiteinstaller.py --file <file>\n\n>>>\tOnly *.tar.gz compressed files!'
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
				print('ONLY *.tar.gz files supported.')
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

# Language Selector
print('\033[1;91m [~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~]')
print(' [                                            ]')
print(' [        FluxIon - Site Installer v' + flinstall_version + '      ]')
print('\033[94m [                                            ]')
print(' [~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~]')
print('\033[39m')
print(' # Select your language:')
print('')
print('[1] English')
print('[2] German')
print('')
lang = raw_input(' [#]:')
if(lang == '1'):
    from en_EN import language
elif(lang == '2'):
    from de_DE import language
else:
    from en_EN import language

# ###############

def check_fluxion():
	global installed_sites, flux_cont
	try:
		fl = open('fluxion','rw')
		flux_cont = fl.read()
		fl.close()
	except:
		print(language.COULD_NOT_OPEN_FLUX)
		sys.exit()
	if(flux_cont <= 100):
		print(language.NO_FLUXION_FOUND)
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
		print(language.CORRUPTED_FLUX)
		sys.exit()

	# Version check
	#vchk = False
	#for version in flux_comp_versions:
	#	if(version == flv):
	#		vchk = True
	#if(vchk == False):
	#	print('Your fluxion version '+color.BOLD + flv  + color.END + '. \nSupported versions are - ' + ' - '.join(reversed(flux_comp_versions)))		
	#	sys.exit()
	# ###############

	installed_sites = int(flux_cont.count('elif [ "$webconf" ='))
	fls = str(installed_sites + 1)  

	# Check on double installation!
	fld = flux_cont[flux_cont.find('$DUMP_PATH/data/index.htm'):]
	if(site_name in fld):
		usdc = raw_input(language.DOUBLE_INSTALL + ' "' + site_name + '" ' + language.CONTINUE_ANYWAY + ' [Y\\n]')
		if(len(usdc) <= 0) or (usdc == 'y') or (usdc == 'yes'):
			pass
		else:			
			sys.exit()
	# ###############

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
	
	print('\033[1;91m [~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~]')
	print(' [                                            ]')
	print(' [        FluxIon - Site Installer v'+ flinstall_version + '      ]')
	print('\033[94m [                                            ]')
	print(' [~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~]')
	print('\033[39m')
	print(' # ############## FluxIon found! ##############')
	print(' # \033[39mVersion: '+ flc[0] +'                              #')
	print(' # \033[39mRevision: '+ flc[1] +'                              #')
	print(' # \033[39mInstalled Sites: '+ flc[2] +'                        #')
	print(' # ############################################')
	print('')
	print(' # ############################################')
	print(' # \033[39mSiteName to install: ' + site_name + whitespacen)
	print(' # \033[39mLanguage flag: ' + site_language + whitespacel)
	print(' # ############################################')
	print('')
	print(' # ########### Everything correct? ############')
	print('')
	usc = raw_input(' # ' + language.BEGIN_INSTALL + '? [Y\\n]').lower()
	if(len(usc) <= 0) or (usc == 'y') or (usc == 'yes'):
		pass
	else:
		print('\n\t # ' + language.NOTHING_CHANGED)
		sys.exit()

# ########################################################################################
# ########################################################################################
# ########################################################################################
# ########################################################################################
# ########################################################################################
# ########################################################################################
# ########################################################################################
welcome()

# ###### First INSERT
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
# ##########################################

# ###### Second INSERT
def insert_at_secondlast_pos2():
	global installed_sites, flux_cont, site_name
	site_number = str(installed_sites +1)
	insert_site = 'elif [ "$webconf" = "'+ site_number +'" ]; then\n\t\t\t\t' + site_name + '\n\t\t\t\tbreak\n\n\t\t\t'
	flux_cont = flux_cont[:int(flux_cont.rfind('elif [ "$webconf" ='))] + insert_site + flux_cont[int(flux_cont.rfind('elif [ "$webconf" =')):]

def last_option_correct_number2():
	global installed_sites, flux_cont
	acc = int(flux_cont.rfind('elif [ "$webconf" ='))
	acc0 = int(flux_cont[acc:].find('" = "')+5)
	before = flux_cont[:acc+acc0]
	after = flux_cont[acc+acc0+2:]
	flux_cont = before + str(installed_sites+2) + after
# ##########################################

# ###### Third INSERT
def insert_at_last_pos3():
	global flux_cont, site_name
	insert_site = '\n\nfunction ' + site_name + ' {\n\tmkdir $DUMP_PATH/data &>$flux_output_device\n\tcp $WORK_DIR/Sites/' + site_name + '/* $DUMP_PATH/data\n\t}'
	before = flux_cont[:int(flux_cont.rfind('}'))+1]
	after = flux_cont[int(flux_cont.rfind('}'))+1:]
	flux_cont = before + insert_site + after
# ##########################################

print('')
print(' # '+ language.CREATING_BACKUP +'...')
try:
	subprocess.Popen(['cp','fluxion', 'bckp_fluxion'])
except:
	print(language.NO_PERM)
	sys.exit()
print(' # ' + language.DONE + '!')

print('')
print(' # ' + language.COPYING_FILES + '...')
try:
	subprocess.Popen(['tar','xfz', site_name + '.tar.gz', '-C', 'Sites/'])
except:
	print(language.COULD_NOT_COPY + '...')
	sys.exit()
print(' # ' + language.DONE + '!')

print('')
print(' # ' + language.RECONFIGURE_FLUXION_BASH + '...')
try:
	insert_at_secondlast_pos1()
	insert_at_secondlast_pos2()
	last_option_correct_number2()
	insert_at_last_pos3()
except:
	print(language.INTERNAL_FAILURE + '...')
	e = sys.exc_info()[0]
	print(language.ERROR + ": %s" % e )
	sys.exit()

print(' # ' + language.DONE + '!')

print('')
print(' # '+ language.REWRITING_FLUXION_BASH + '...')
try:
	wflux = open('fluxion','w')
	wflux.write(flux_cont)
	wflux.close()
except:
	print(language.FATAL_ERROR + '[501]...')
	print(language.TRYING_TO_RESTORE_BACKUP)
	try:
		subprocess.Popen(['mv','bckp_fluxion', 'fluxion'])
		print('FluxIon ' + language.BACKUP_RESTORED + '...')
	except:
		print(language.FATAL_ERROR + '[502]...')
	sys.exit()
print(' # ' + language.DONE + '!')

print('')
print(' # ' + language.SETTING_MODES + '...')
try:
	subprocess.Popen(['chmod','755', 'Sites/' + site_name +'/'])
	subprocess.Popen(['chmod','644', '-R', 'Sites/' + site_name +'/'])
	print(' # ' + DONE + '!')
except:
    pass
	#print('ERROR[506]... ' + language.CONTINUE + '...')
	#print("Unexpected error:", sys.exc_info()[0])

print('')
print(' # ' + language.VERIFYING_INTEG + '...')
try:
	fluxit = open('fluxion','r')
	integ_fluxion = fluxit.read()
	fluxit.close()
	if(len(integ_fluxion) == len(flux_cont)):
		print(' # ' + language.DONE + '!')
		print(' # ' + language.DELETING_BACKUP + '...')
		subprocess.Popen(['rm','bckp_fluxion'])
	else:
		print(language.FATAL_ERROR + '[509]...')
		sys.exit()
except:
	print(language.FATAL_ERROR + '[503]...')
	sys.exit()

print('\n # ' + site_name + '" ' + language.SUCCESS + '!')
	

