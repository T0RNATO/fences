<script setup lang="ts">
import ProgressiveForm from "~/components/ProgressiveForm.vue";
import Text from "~/components/form/Text.vue";
import Radio from "~/components/form/Radio.vue";
</script>

<template>
    <div class="panel w-full h-full flex md:flex-row flex-col gap-x-4">
        <div class="md:w-1/2 max-md:h-1/2">
            <h2>Create Fence Model</h2>
            <div class="greyed text-sm max-md:after:content-['_Note_that_this_page_is_unlikely_to_work_well_on_mobile.']">
                For any enquiries not fulfilled by this form and the comments box, please contact foo@bar.com TODO: Instructions.
            </div>
            <div class="mt-2 grid grid-cols-[30%_70%] items-center gap-y-2 max-md:text-sm">
                <ProgressiveForm #="{form}">
                    <h3 class="col-span-2">General</h3>
                    Property Frontage<br>(Fence Length)
                    <Text :form="form" name="length" units="metres" :number="true"/>
                    Pier Width:
                    <Radio :form="form" name="pier_width" :options="{0.23: '230mm', 0.35: '350mm', 0.47: '470mm', 0.59: '590mm'}" depends="length"/>
                    <h3 class="col-span-2">Pier Spacing</h3>
                    <Radio :form="form" name="pier_spacing" class="col-span-2 flex-col" depends="pier_width" dots :options="{
                        num_piers: 'Evenly space N piers',
                        distance: 'Evenly space piers approx. N metres apart',
                        absolute_dist: 'Space piers N metres apart, with a different final spacing on the left/right'
                    }"/>
                </ProgressiveForm>
            </div>
        </div>
        <div class="aspect-square md:w-1/2 max-md:h-1/2 bg-slate-500 rounded-lg p-4">
            3D Model Stand-In
        </div>
    </div>
</template>

<style scoped>

</style>