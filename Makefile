#  Makefile
#  
#  Copyright 2020 Alvarito050506 <donfrutosgomez@gmail.com>
#  Copyright 2020 The Box Critters Modding Community
#  
#  This program is free software; you can redistribute it and/or modify
#  it under the terms of the GNU General Public License as published by
#  the Free Software Foundation; version 2 of the License.
#  
#  This program is distributed in the hope that it will be useful,
#  but WITHOUT ANY WARRANTY; without even the implied warranty of
#  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
#  GNU General Public License for more details.
#  
#  You should have received a copy of the GNU General Public License
#  along with this program; if not, write to the Free Software
#  Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston,
#  MA 02110-1301, USA.
#  
#  

all:
	rm -rf build/
	mkdir -p ./build/
	zip -r ./build/bc-modload.xpi * -x "build/*" -x Makefile -x README.md >/dev/null
	zip -r ./build/bc-modload.zip * -x "build/*" -x Makefile -x README.md >/dev/null
	zip -r ./build/bc-modload.crx * -x "build/*" -x Makefile -x README.md >/dev/null
