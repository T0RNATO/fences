<script setup lang="ts">
import ProgressiveForm from "~/components/ProgressiveForm.vue";
import Text from "~/components/form/Text.vue";
import Radio from "~/components/form/Radio.vue";
</script>

<template>
    <div class="panel w-full h-full flex mobile:flex-row flex-col gap-x-4">
        <div class="mobile:w-1/2 max-mobile:h-1/2 pb-2 overflow-y-auto">
            <h2>Create Fence Model</h2>
            <div class="greyed text-sm max-mobile:after:content-['_Note_that_this_page_is_unlikely_to_work_well_on_mobile.']">
                For any enquiries not fulfilled by this form and the comments box, please contact foo@bar.com.
                Entries marked with a red underline require attention.
            </div>
            <div class="mt-2 sm:grid sm:grid-cols-[30%_70%] items-center gap-y-2 text-sm">
                <ProgressiveForm #="{form}">
                    <h3 class="col-span-2">General</h3>
                    Property Frontage:<br class="max-sm:hidden">(Fence Length)
                    <Text :form="form" name="length" units="metres" :number="true"/>
                    Pier Width:
                    <Radio :form="form" name="pier_width" :options="{0.23: '230mm', 0.35: '350mm', 0.47: '470mm', 0.59: '590mm'}" depends="length"/>
                    Pier Height:
                    <Text :form="form" name="pier_height" units="metres" :number="true"/>
                    Maximum Height:<br class="max-sm:hidden">(For error checking)
                    <Text :form="form" name="max_height" units="metres" :number="true" depends="pier_height"/>
                    Fence Panel Height:
                    <Text :form="form" name="panel_height" units="metres" :number="true" depends="pier_height"/>
                    Fence Panel Thickness:
                    <Text :form="form" name="panel_thickness" units="millimetres" :number="true" depends="panel_height"/>

                    <h3 class="col-span-2">Pier Spacing</h3>
                    <Radio :form="form" name="pier_spacing" class="col-span-2 flex-col" depends="pier_width" dots :options="{
                        num_piers: 'Evenly space $a$ piers',
                        distance: 'Evenly space piers approx. $b$ metres apart',
                        absolute_dist: 'Space piers $c$ metres apart, with a different final spacing on the $d$'
                        // manual setting?
                    }">
                        <template #a>
                            <Text :form="form" name="num_piers" :number="true"
                                  :validate="value => form['pier_spacing'].value.value !== 'num_piers' || (Boolean(value) && Number.isInteger(value))"
                                  depends="pier_width" class="!mx-1 h-8 w-12"
                            />
                        </template> <template #b>
                            <Text :form="form" name="space_betw_piers" :number="true"
                                  :validate="value => form['pier_spacing'].value.value !== 'distance' || Boolean(value)"
                                  depends="pier_width" class="!mx-1 h-8 w-12"
                            />
                        </template> <template #c>
                            <Text :form="form" name="space_betw_piers_abs" :number="true"
                                  :validate="value => form['pier_spacing'].value.value !== 'absolute_dist' || Boolean(value)"
                                  depends="pier_width" class="!mx-1 h-8 w-12"
                            />
                        </template> <template #d>
                            <Radio :form="form" name="different_final_spacing" :options="{left: 'Left', right: 'Right'}"
                                   :validate="value => form['pier_spacing'].value.value !== 'absolute_dist' || Boolean(value)"
                                   depends="pier_width" class="!mx-1 h-8 w-12"
                            />
                        </template>
                    </Radio>

                    <h3 class="col-span-2">Property Gradient</h3>
                    Gradient Present:
                    <Radio :form="form" name="is_gradient" :options="{yes: 'Yes', no: 'No'}" depends="pier_spacing" default="no"/>
                    Gradient:
                    <div class="flex gap-x-2 items-center">
                        <Text class="w-15" :form="form" name="gradient" units="%" :number="true" depends="is_gradient"
                              :validate="value => form['is_gradient'].value.value === 'no' || form['rise'].valid.value || form['run'].valid.value || Boolean(value)"/>
                        or
                        <Text class="w-15" placeholder="rise" :form="form" name="rise" :number="true" depends="is_gradient"
                              :validate="value => form['is_gradient'].value.value === 'no' || Boolean(form['gradient'].value.value) || Boolean(value)"/>
                        /
                        <Text class="w-15" placeholder="run" :form="form" name="run" :number="true" depends="is_gradient"
                              :validate="value => form['is_gradient'].value.value === 'no' || Boolean(form['gradient'].value.value) || Boolean(value)"/>
                    </div>
                </ProgressiveForm>
            </div>
        </div>
        <div class="aspect-square mobile:w-1/2 max-mobile:h-1/2 bg-slate-500 rounded-lg p-4">
            3D Model Stand-In
        </div>
    </div>
</template>

<style scoped>

</style>